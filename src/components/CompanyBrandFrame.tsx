import React from 'react';
import { ContactCard } from '../types';
import { getBrandInfo, getBrandIconComponent } from '../utils/brandUtils';

interface CompanyBrandFrameProps {
  card: ContactCard;
  categoryColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTagline?: boolean;
}

export const CompanyBrandFrame: React.FC<CompanyBrandFrameProps> = ({
  card,
  categoryColor,
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  const brand = getBrandInfo(card, categoryColor);
  const IconComponent = getBrandIconComponent(brand.iconName);

  if (size === 'sm') {
    // List view thumbnail or compact icon badge
    return (
      <div
        className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs relative overflow-hidden border border-black/10 dark:border-white/10 ${className}`}
        style={{
          background: `linear-gradient(135deg, ${brand.primaryColor} 0%, ${brand.secondaryColor} 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-[1px]" />
        <span className="relative text-xs font-black tracking-wider text-white select-none">
          {brand.monogram}
        </span>
      </div>
    );
  }

  // Medium / Large Banner (Reimagined card header frame)
  return (
    <div
      className={`relative w-full overflow-hidden select-none flex flex-col justify-between ${
        size === 'lg' ? 'aspect-[2.2/1] p-6 pt-6' : 'aspect-[1.75/1] px-3.5 pb-3 pt-9.5'
      } ${className}`}
      style={{
        background: `linear-gradient(145deg, #090d16 0%, #0f172a 45%, ${brand.secondaryColor} 140%)`,
      }}
    >
      {/* Background Subtle Geometric Texture & Ambient Light Ring */}
      <div
        className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full blur-2xl pointer-events-none opacity-40 transition-opacity"
        style={{ backgroundColor: brand.primaryColor }}
      />
      <div
        className="absolute -left-10 -top-10 w-36 h-36 rounded-full blur-xl pointer-events-none opacity-25"
        style={{ backgroundColor: brand.accentColor }}
      />

      {/* Subtle Grid Dot Watermark for Minimalist Precision */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Brand Color Top Accent Edge Line */}
      <div
        className="absolute top-0 inset-x-0 h-1 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, ${brand.primaryColor} 0%, ${brand.accentColor} 50%, transparent 100%)`,
        }}
      />

      {/* Brand Identity Body (Brought Down to Clear Top Checkbox & CRM/Favorite Buttons) */}
      <div className="relative z-10 flex items-center justify-between mt-auto mb-1.5">
        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
          {/* Company Monogram Emblem */}
          <div
            className={`rounded-xl flex items-center justify-center font-black tracking-wider text-white shadow-md border border-white/20 shrink-0 ${
              size === 'lg' ? 'h-10 w-10 text-sm' : 'h-8 w-8 text-xs'
            }`}
            style={{
              background: `linear-gradient(135deg, ${brand.primaryColor} 0%, ${brand.secondaryColor} 100%)`,
            }}
          >
            {brand.monogram}
          </div>

          <div className="min-w-0">
            <span
              className={`block font-extrabold tracking-wide text-white truncate drop-shadow-xs ${
                size === 'lg' ? 'text-base' : 'text-xs'
              }`}
            >
              {card.company}
            </span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span
                className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                style={{ backgroundColor: brand.accentColor }}
              />
              <span className="text-[10px] font-medium text-slate-300/80 truncate">
                {card.department || card.category || 'Corporate'}
              </span>
            </div>
          </div>
        </div>

        {/* Minimalist Brand Accent Swatch Pill */}
        <div className="shrink-0 flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-mono font-semibold text-slate-200">
          <span
            className="w-1.5 h-1.5 rounded-full inline-block shadow-2xs"
            style={{ backgroundColor: brand.primaryColor }}
          />
          <span>{brand.primaryColor.toUpperCase()}</span>
        </div>
      </div>

      {/* Brand Bottom Bar: Tagline, Category & Vector Symbol */}
      <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-1.5">
        <div className="min-w-0 pr-2">
          {showTagline && (
            <p
              className={`font-medium tracking-tight text-slate-300/90 line-clamp-1 ${
                size === 'lg' ? 'text-xs' : 'text-[10px]'
              }`}
            >
              {brand.tagline}
            </p>
          )}
          <span className="text-[9px] font-bold text-slate-400/80 tracking-wider uppercase mt-0.5 block">
            {card.category?.toUpperCase() || 'BUSINESS CONTACT'}
          </span>
        </div>

        {/* Subtle Brand Vector Symbol Watermark */}
        <div
          className="shrink-0 p-1 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm text-slate-300"
          style={{ color: brand.accentColor }}
        >
          <IconComponent className={size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
        </div>
      </div>
    </div>
  );
};
