import React from 'react';
import {
  Building2,
  Cpu,
  Shield,
  Sparkles,
  Scale,
  Landmark,
  Layers,
  Globe,
  Zap,
  Briefcase,
  TrendingUp,
  LineChart,
  Lock,
  Database,
  Cloud,
  Code2,
  Atom,
  Server
} from 'lucide-react';
import { ContactCard } from '../types';

export interface BrandInfo {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  monogram: string;
  cleanCompanyName: string;
  iconName: string;
  tagline: string;
}

const BRAND_PALETTES: Record<string, { primary: string; secondary: string; accent: string; icon: string; tagline: string }> = {
  'apex ai systems': {
    primary: '#0284c7',
    secondary: '#0369a1',
    accent: '#38bdf8',
    icon: 'Cpu',
    tagline: 'Autonomous AI & Machine Learning',
  },
  'quantumleap robotics': {
    primary: '#4f46e5',
    secondary: '#4338ca',
    accent: '#818cf8',
    icon: 'Atom',
    tagline: 'Advanced Robotics & Automation',
  },
  'nexus scale cloud': {
    primary: '#0ea5e9',
    secondary: '#0284c7',
    accent: '#7dd3fc',
    icon: 'Cloud',
    tagline: 'Distributed Cloud Architecture',
  },
  'ciphergate cyber': {
    primary: '#059669',
    secondary: '#047857',
    accent: '#34d399',
    icon: 'Shield',
    tagline: 'Zero-Trust Defense Systems',
  },
  'neuralsphere labs': {
    primary: '#7c3aed',
    secondary: '#6d28d9',
    accent: '#a78bfa',
    icon: 'Sparkles',
    tagline: 'Cognitive Computing & Neural Nets',
  },
  'devstream engine': {
    primary: '#2563eb',
    secondary: '#1d4ed8',
    accent: '#60a5fa',
    icon: 'Code2',
    tagline: 'Developer Tooling & Pipelines',
  },
  'polargrid networks': {
    primary: '#0891b2',
    secondary: '#0e7490',
    accent: '#22d3ee',
    icon: 'Server',
    tagline: 'High-Throughput Edge Infrastructure',
  },
  'datamesh analytics': {
    primary: '#6366f1',
    secondary: '#4f46e5',
    accent: '#a5b4fc',
    icon: 'Database',
    tagline: 'Unified Enterprise Data Fabric',
  },
  'hyperion quantum computing': {
    primary: '#d97706',
    secondary: '#b45309',
    accent: '#fcd34d',
    icon: 'Atom',
    tagline: 'Next-Gen Qubit Systems',
  },
  'orbitcloud global': {
    primary: '#1d4ed8',
    secondary: '#1e40af',
    accent: '#93c5fd',
    icon: 'Globe',
    tagline: 'Satellite & Terrestrial Connectivity',
  },
  'vance sterling capital': {
    primary: '#0f766e',
    secondary: '#115e59',
    accent: '#2dd4bf',
    icon: 'Landmark',
    tagline: 'Private Equity & Venture Capital',
  },
  'horizon global bank': {
    primary: '#1e3a8a',
    secondary: '#172554',
    accent: '#60a5fa',
    icon: 'Landmark',
    tagline: 'Institutional Banking & Markets',
  },
  'thorne & blackwell wealth': {
    primary: '#334155',
    secondary: '#1e293b',
    accent: '#94a3b8',
    icon: 'TrendingUp',
    tagline: 'Private Wealth & Asset Advisory',
  },
  'aurelia private equity': {
    primary: '#9f1239',
    secondary: '#881337',
    accent: '#fb7185',
    icon: 'LineChart',
    tagline: 'Global Buyout & Growth Equity',
  },
  'pacific crest securities': {
    primary: '#047857',
    secondary: '#065f46',
    accent: '#34d399',
    icon: 'Briefcase',
    tagline: 'Capital Markets & Underwriting',
  },
  'sterling, reed & vance llp': {
    primary: '#b45309',
    secondary: '#92400e',
    accent: '#fbbf24',
    icon: 'Scale',
    tagline: 'Corporate Law & IP Litigation',
  },
  'apex global advisory': {
    primary: '#374151',
    secondary: '#1f2937',
    accent: '#9ca3af',
    icon: 'Building2',
    tagline: 'Regulatory & Strategic Counsel',
  },
  'sterling law partners': {
    primary: '#7c2d12',
    secondary: '#701a75',
    accent: '#fdba74',
    icon: 'Scale',
    tagline: 'Mergers, Acquisitions & Compliance',
  },
  'mendoza legal group': {
    primary: '#475569',
    secondary: '#334155',
    accent: '#cbd5e1',
    icon: 'Scale',
    tagline: 'Cross-Border Arbitration & Trade',
  },
  'global lex counsel': {
    primary: '#1e293b',
    secondary: '#0f172a',
    accent: '#64748b',
    icon: 'Scale',
    tagline: 'International Commercial Law',
  },
};

/**
 * Derives a sophisticated monogram from company name.
 * e.g. "Apex AI Systems" -> "AA", "Vance Sterling Capital" -> "VS", "QuantumLeap Robotics" -> "QL"
 */
export function getCompanyMonogram(companyName: string): string {
  if (!companyName) return 'CO';
  const clean = companyName.replace(/LLP|Inc\.?|LLC|Ltd\.?|Corp\.?|Group/gi, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (words[0].length >= 2) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return words[0][0].toUpperCase();
}

/**
 * Computes deterministic brand info (color, logo icon, tagline) for any contact card.
 */
export function getBrandInfo(card: ContactCard, categoryColor?: string): BrandInfo {
  const compKey = (card.company || '').toLowerCase().trim();
  const monogram = getCompanyMonogram(card.company);

  if (BRAND_PALETTES[compKey]) {
    const p = BRAND_PALETTES[compKey];
    return {
      primaryColor: card.primaryColorHex || p.primary,
      secondaryColor: p.secondary,
      accentColor: p.accent,
      monogram,
      cleanCompanyName: card.company,
      iconName: p.icon,
      tagline: p.tagline,
    };
  }

  // Fallback heuristic based on Category or string hash
  const isLegal = (card.category || '').toLowerCase().includes('legal');
  const isFinance = (card.category || '').toLowerCase().includes('finance') || (card.category || '').toLowerCase().includes('bank');
  const isTech = (card.category || '').toLowerCase().includes('tech');

  let primary = card.primaryColorHex || categoryColor || '#2563eb';
  let secondary = '#1e3a8a';
  let accent = '#60a5fa';
  let iconName = 'Building2';
  let tagline = 'Enterprise Solutions & Services';

  if (isLegal) {
    primary = card.primaryColorHex || categoryColor || '#b45309';
    secondary = '#78350f';
    accent = '#fbbf24';
    iconName = 'Scale';
    tagline = 'Legal Services & Advisory';
  } else if (isFinance) {
    primary = card.primaryColorHex || categoryColor || '#0f766e';
    secondary = '#134e4a';
    accent = '#2dd4bf';
    iconName = 'Landmark';
    tagline = 'Financial & Capital Advisory';
  } else if (isTech) {
    primary = card.primaryColorHex || categoryColor || '#0284c7';
    secondary = '#0369a1';
    accent = '#38bdf8';
    iconName = 'Cpu';
    tagline = 'Technology & Infrastructure';
  }

  return {
    primaryColor: primary,
    secondaryColor: secondary,
    accentColor: accent,
    monogram,
    cleanCompanyName: card.company || 'Enterprise Corp',
    iconName,
    tagline,
  };
}

/**
 * Returns the Lucide Icon component for the given icon name.
 */
export function getBrandIconComponent(iconName: string): React.ElementType {
  switch (iconName) {
    case 'Cpu':
      return Cpu;
    case 'Atom':
      return Atom;
    case 'Cloud':
      return Cloud;
    case 'Shield':
      return Shield;
    case 'Sparkles':
      return Sparkles;
    case 'Code2':
      return Code2;
    case 'Server':
      return Server;
    case 'Database':
      return Database;
    case 'Globe':
      return Globe;
    case 'Landmark':
      return Landmark;
    case 'TrendingUp':
      return TrendingUp;
    case 'LineChart':
      return LineChart;
    case 'Scale':
      return Scale;
    case 'Briefcase':
      return Briefcase;
    default:
      return Building2;
  }
}
