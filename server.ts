import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set payload limit to handle high-resolution multi-card images (up to 10 cards in 1 photo)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Single or Multi-Card OCR Extraction Endpoint
// Capable of detecting up to 10+ business cards in a single photo, returning each with bounding boxes & structured details
app.post("/api/ocr/scan", async (req, res) => {
  try {
    const { imageBase64, mode = "batch", hints = "" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing image data." });
    }

    const ai = getGeminiClient();

    // Clean base64 string
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
    const mimeMatch = imageBase64.match(/^data:(image\/[a-z]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

    const systemPrompt = `You are an elite enterprise-grade Business Card Optical Character Recognition (OCR) and contact parsing engine.
Your task is to analyze the provided image which may contain ONE business card OR MULTIPLE business cards (up to 10+ business cards arranged on a table, desk, scanner sheet, or holder).

Instructions:
1. Locate EVERY distinct physical business card visible in the image.
2. For each card found, estimate its bounding box [ymin, xmin, ymax, xmax] in normalized 0-1000 integer coordinates relative to the full image.
3. Accurately extract all text and categorize each item into standard contact fields:
   - fullName: Person's full name
   - jobTitle: Job title or professional designation (e.g. VP of Sales, Senior Architect, Founder & CEO)
   - company: Organization or company name
   - department: Department or team (if present)
   - email: Primary email address (clean and validate format)
   - phone: Primary direct/mobile phone number
   - mobilePhone: Secondary mobile or office phone if distinct
   - website: Website URL (standardize with https:// if missing)
   - address: Physical address object with street, city, state, zip, country
   - social: Social handles or profile URLs (LinkedIn, Twitter/X, GitHub, etc.)
   - category: Business category / industry (e.g., "Technology", "Healthcare", "Finance & Banking", "Legal", "Consulting", "Real Estate", "Creative & Media", "Manufacturing", "Energy", "Other")
   - suggestedTags: 2 to 4 relevant tags (e.g. ["Executive", "AI", "Sales Lead", "Conference 2026"])
   - notes: Additional details (e.g., tagline, licenses, QR note, back notes)
   - primaryColorHex: Dominant aesthetic color of the card brand (e.g., "#1e3a8a", "#0f766e", "#000000", "#b45309", etc.)
   - confidenceScore: Estimated extraction confidence integer between 70 and 99 based on legibility and completeness.
   - cardIndex: 1-indexed number of the card (1 to N, ordered top-to-bottom, left-to-right).

Mode: ${mode === "single" ? "Focus with high precision on the single dominant business card." : "Scan for multiple business cards (1 to 10+ cards). Detect all cards present."}
${hints ? `Context hints: ${hints}` : ""}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: "Extract and structure all business cards found in this photo.",
          },
        ],
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedCardCount: {
              type: Type.INTEGER,
              description: "Total number of distinct business cards detected in the image.",
            },
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  cardIndex: { type: Type.INTEGER },
                  fullName: { type: Type.STRING },
                  jobTitle: { type: Type.STRING },
                  company: { type: Type.STRING },
                  department: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  mobilePhone: { type: Type.STRING },
                  website: { type: Type.STRING },
                  street: { type: Type.STRING },
                  city: { type: Type.STRING },
                  state: { type: Type.STRING },
                  zip: { type: Type.STRING },
                  country: { type: Type.STRING },
                  linkedin: { type: Type.STRING },
                  twitter: { type: Type.STRING },
                  category: { type: Type.STRING },
                  suggestedTags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  notes: { type: Type.STRING },
                  primaryColorHex: { type: Type.STRING },
                  confidenceScore: { type: Type.INTEGER },
                  boundingBox: {
                    type: Type.OBJECT,
                    properties: {
                      ymin: { type: Type.INTEGER },
                      xmin: { type: Type.INTEGER },
                      ymax: { type: Type.INTEGER },
                      xmax: { type: Type.INTEGER },
                    },
                    required: ["ymin", "xmin", "ymax", "xmax"],
                  },
                },
                required: ["cardIndex", "fullName", "company"],
              },
            },
          },
          required: ["detectedCardCount", "cards"],
        },
      },
    });

    const rawText = response.text || "{}";
    const parsedData = JSON.parse(rawText);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("OCR Scan API Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to process card OCR.",
    });
  }
});

// CRM Sync Mock/Integration Gateway
app.post("/api/crm/sync", async (req, res) => {
  try {
    const { provider, contacts, apiKey, options } = req.body;

    if (!provider || !contacts || !Array.isArray(contacts)) {
      return res.status(400).json({ error: "Invalid sync payload." });
    }

    // Simulate realistic CRM API response with simulated sync IDs & timing
    const results = contacts.map((c: any) => ({
      contactId: c.id,
      remoteId: `${provider.toLowerCase()}_${Math.random().toString(36).substring(2, 9)}`,
      status: "synced",
      syncedAt: new Date().toISOString(),
      provider: provider,
      message: `Successfully synchronized ${c.name || "Contact"} to ${provider}`,
    }));

    return res.json({
      success: true,
      provider,
      syncedCount: results.length,
      results,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Secure Cloud Backup Store/Restore
let inMemoryBackupStore: Record<string, { data: any; updatedAt: string }> = {};

app.post("/api/backup/save", (req, res) => {
  try {
    const { backupKey, encryptedPayload, metadata } = req.body;
    if (!backupKey || !encryptedPayload) {
      return res.status(400).json({ error: "Missing backup key or payload" });
    }

    inMemoryBackupStore[backupKey] = {
      data: { encryptedPayload, metadata },
      updatedAt: new Date().toISOString(),
    };

    return res.json({
      success: true,
      timestamp: inMemoryBackupStore[backupKey].updatedAt,
      sizeBytes: JSON.stringify(encryptedPayload).length,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/backup/load", (req, res) => {
  try {
    const { backupKey } = req.body;
    if (!backupKey || !inMemoryBackupStore[backupKey]) {
      return res.status(404).json({ error: "No cloud backup found for this key." });
    }

    return res.json({
      success: true,
      backup: inMemoryBackupStore[backupKey],
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CardBase AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
