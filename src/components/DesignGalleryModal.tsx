import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Layout, Palette, Compass, Layers, CheckCircle2, ChevronRight, Eye } from 'lucide-react';

// Generated visual mockups
import imgExecDark from '../assets/images/design_options_executive_dark_1787816400647.jpg';
import imgSwiss from '../assets/images/design_options_swiss_editorial_1787816423018.jpg';
import imgRolodex from '../assets/images/design_options_rolodex_3d_1787816443203.jpg';
import imgLedger from '../assets/images/design_options_b2b_ledger_1787816459331.jpg';
import imgNetwork from '../assets/images/design_options_network_map_1787816474530.jpg';

interface DesignConcept {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  accent: string;
  image: string;
  highlights: string[];
  vibe: string;
  targetAudience: string;
}

const DESIGN_OPTIONS: DesignConcept[] = [
  {
    id: 'exec_dark',
    title: '1. Executive Dark Minimalist',
    subtitle: 'Fintech & High-End Obsidian Canvas',
    tag: 'Luxury & Sleek',
    accent: '#6366F1',
    image: imgExecDark,
    vibe: 'Deep obsidian slate (#0B0F19), brushed titanium buttons, frosted glass card holders, and subtle gold/emerald status lights.',
    targetAudience: 'Senior executives, luxury sales consultants, and venture leaders.',
    highlights: [
      'Matte cardstock texture with metallic edge highlights',
      'Floating micro-blur pill action bars for one-handed mobile use',
      'High-contrast monochromatic status badges with instant CRM indicators'
    ]
  },
  {
    id: 'swiss_editorial',
    title: '2. Swiss Editorial & Clean Studio',
    subtitle: 'Typography & Alabaster White Space',
    tag: 'Editorial & Clean',
    accent: '#0F172A',
    image: imgSwiss,
    vibe: 'Warm alabaster paper (#F9F9FB), crisp 1px hairline grids, bold serif titles paired with Neue grotesque body text, letterpress card look.',
    targetAudience: 'Architects, creative directors, consultants, and design agency founders.',
    highlights: [
      'Magazine-style contact index cards with crisp typography',
      'Monospaced metadata columns (phone, email, role, tags)',
      'Tactile stationery feel mimicking physical letterpress cards'
    ]
  },
  {
    id: 'rolodex_3d',
    title: '3. Smart Rolodex / 3D Carousel',
    subtitle: 'Tactile Nostalgia & Gesture Browsing',
    tag: 'Tactile & Intuitive',
    accent: '#F59E0B',
    image: imgRolodex,
    vibe: 'Neo-tactile UI with smooth physical momentum scrolling, diffused ambient shadows, and 3D card perspective rotations.',
    targetAudience: 'Conference power attendees and trade-show networkers.',
    highlights: [
      'Interactive 3D carousel that flips cards smoothly as you swipe',
      'Swipe gestures: swipe right to dial/email, swipe left to CRM sync',
      'Realistic card flip animation to inspect backside notes or raw capture'
    ]
  },
  {
    id: 'b2b_ledger',
    title: '4. Speed-First B2B CRM Ledger',
    subtitle: 'High-Density Linear-Style Dashboard',
    tag: 'Power User & Fast',
    accent: '#10B981',
    image: imgLedger,
    vibe: 'Utilitarian, keyboard-driven table mode inspired by Linear and Raycast, compact rows, split-pane inspector, and instant inline tag editing.',
    targetAudience: 'Sales representatives, SDRs, recruiters, and BD leads managing high volume.',
    highlights: [
      'Spreadsheet / Command-K table mode with instant keyboard shortcuts',
      'Direct inline editing with instant auto-save without opening modals',
      'Pipeline stages (Lead, Meeting Booked, Contacted, VIP) in header pills'
    ]
  },
  {
    id: 'network_map',
    title: '5. Spatial Relationship & Company Map',
    subtitle: 'Interactive Network Graph & Ecosystems',
    tag: 'Visual & Analytical',
    accent: '#06B6D4',
    image: imgNetwork,
    vibe: 'Clean dark canvas with dynamic connected node clusters grouping contacts by Company, Industry, City, or Conference event tag.',
    targetAudience: 'Venture capitalists, corporate development, community builders, and strategists.',
    highlights: [
      'Interactive node clusters grouped by company domain and industry',
      'Visual relationship mapping showing colleague connections in same firm',
      'Timeline slider tracking professional network growth chronologically'
    ]
  }
];

interface DesignGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignGalleryModal: React.FC<DesignGalleryModalProps> = ({ isOpen, onClose }) => {
  const [selectedId, setSelectedId] = useState<string>(DESIGN_OPTIONS[0].id);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentConcept = DESIGN_OPTIONS.find((c) => c.id === selectedId) || DESIGN_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Design Concepts Gallery
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold">
                  5 Visual Options
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explore visual mockups and layout directions for CardBase AI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close Gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {DESIGN_OPTIONS.map((concept) => {
              const isSelected = concept.id === selectedId;
              return (
                <button
                  key={concept.id}
                  onClick={() => setSelectedId(concept.id)}
                  className={`p-3 text-left rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 shadow-sm ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div className="font-bold truncate text-slate-900 dark:text-white">{concept.title}</div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="truncate">{concept.tag}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 ml-1" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Concept Showcase Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {/* Visual Image Preview */}
            <div className="lg:col-span-7 flex flex-col space-y-2">
              <div
                onClick={() => setLightboxImage(currentConcept.image)}
                className="group relative cursor-zoom-in rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md aspect-[16/9] bg-slate-900 flex items-center justify-center"
              >
                <img
                  src={currentConcept.image}
                  alt={currentConcept.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-lg bg-black/70 text-white text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Click to Expand Full View
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                High-resolution mockup generated for CardBase AI
              </p>
            </div>

            {/* Concept Details & Feature Highlights */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-2">
                  {currentConcept.tag}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {currentConcept.title}
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-3">
                  {currentConcept.subtitle}
                </p>

                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <div>
                    <strong className="block text-slate-900 dark:text-white font-semibold mb-0.5">
                      Visual Aesthetic:
                    </strong>
                    <p className="leading-relaxed">{currentConcept.vibe}</p>
                  </div>

                  <div>
                    <strong className="block text-slate-900 dark:text-white font-semibold mb-0.5">
                      Target Workflow:
                    </strong>
                    <p className="leading-relaxed">{currentConcept.targetAudience}</p>
                  </div>

                  <div>
                    <strong className="block text-slate-900 dark:text-white font-semibold mb-1">
                      Key UI Innovations:
                    </strong>
                    <ul className="space-y-1.5 pl-1">
                      {currentConcept.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <ChevronRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                Tip: You can request to adopt any of these themes as the default skin or add a view switcher!
              </div>
            </div>
          </div>

          {/* Grid Preview of All 5 Images at a Glance */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3">
              All 5 Concepts at a Glance
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {DESIGN_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedId(opt.id)}
                  className={`group cursor-pointer rounded-xl border p-2 bg-white dark:bg-slate-900 transition-all ${
                    opt.id === selectedId
                      ? 'ring-2 ring-blue-500 border-blue-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="rounded-lg overflow-hidden aspect-[16/9] bg-slate-950 mb-2 relative">
                    <img
                      src={opt.image}
                      alt={opt.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                    {opt.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{opt.tag}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Click any concept to review details</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </motion.div>

      {/* Lightbox Expand View */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 cursor-zoom-out"
          >
            <div className="relative max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              <img
                src={lightboxImage}
                alt="Expanded Design Mockup"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
