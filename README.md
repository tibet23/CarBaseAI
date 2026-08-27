# CardBase AI

> Intelligent multi-card business scanner and CRM synchronization engine.

CardBase AI transforms how professionals capture and manage physical business cards. It replaces manual contact entry with batch AI computer vision, instant contact parsing, and seamless CRM integrations.

---

## Key Features

### 1. Batch & Single-Card Scanning
- **10-Card Overhead Capture**: Scan up to 10 cards simultaneously from a single overhead photo.
- **Smart Boundary Detection**: Automatically locates, crops, deskews, and isolates each card in the frame.
- **Live Reticle Viewfinder**: High-contrast, golden-ratio alignment frame for single-card captures with front and back scanning support.

### 2. Dual-Engine OCR & Parsing
- **Gemini Vision Engine**: Cloud-based extraction for multilingual text, logos, social handles, job titles, and company details.
- **Offline Tesseract Fallback**: Client-side OCR runs entirely in the browser when network access is unavailable.

### 3. CRM & Contact Integrations
- **1-Click Synchronization**: Push contacts directly to HubSpot, Salesforce, Zoho CRM, and Google Contacts.
- **Universal Exports**: Download single or bulk `.vcf` (vCard 3.0), `.csv` spreadsheets, or formatted printable contact sheets.
- **Interactive QR vCards**: Generate on-demand QR codes for instant device contact saving.

### 4. Mobile-First Progressive Web App (PWA)
- Fully responsive layout optimized for iPhone, iPad, and Android devices.
- Install directly from mobile browsers to home screen with offline caching and native camera access.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend / API**: Express, Node.js, `@google/genai` (Gemini API)
- **Computer Vision & OCR**: Gemini Vision, Tesseract.js
- **Build Tool**: Vite, esbuild

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cardbase-ai.git
   cd cardbase-ai
