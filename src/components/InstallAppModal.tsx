import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Share, PlusSquare, CheckCircle2, X, Apple, Chrome, Layers, Sparkles } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('android');

  useEffect(() => {
    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Check if already in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event (Android / Chromium)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#090d16] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800/90 w-full max-w-lg overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#0b1120]/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Download Mobile App
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Zero App Store Hassle
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Install directly on your phone with camera, batch OCR &amp; offline mode
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* App Preview Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-transparent border border-blue-500/20 flex items-center space-x-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0 border border-white/20">
              <Layers className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">CardBase AI</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Ready to install
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Full-screen standalone app • Instant camera launch • Offline OCR
              </p>
            </div>
          </div>

          {/* If 1-Click Install is available (Chromium / Android) */}
          {deferredPrompt && (
            <div className="space-y-3">
              <button
                onClick={handleNativeInstall}
                className="w-full min-h-[48px] inline-flex items-center justify-center px-6 py-3 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all shadow-lg shadow-blue-600/30 cursor-pointer border border-blue-400/30"
              >
                <Download className="h-4 w-4 mr-2" />
                1-Click Instant Install on Phone
              </button>
            </div>
          )}

          {/* Platform Instructions (iOS Safari & Android Chrome) */}
          <div className="space-y-4">
            
            {/* iOS Instructions */}
            <div className={`p-4 rounded-2xl border transition-all ${
              platform === 'ios' 
                ? 'border-blue-500 bg-blue-50/40 dark:bg-[#0e162a] ring-1 ring-blue-500/30' 
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070b14]'
            }`}>
              <div className="flex items-center space-x-2 font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-2.5">
                <Apple className="h-4 w-4 text-slate-800 dark:text-slate-200" />
                <span>iPhone / iPad (Safari) Instructions</span>
                {platform === 'ios' && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Your Device
                  </span>
                )}
              </div>
              <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">1.</span>
                  <span>Tap the <strong className="text-slate-900 dark:text-white">Share</strong> button <Share className="inline h-3.5 w-3.5 mx-1 text-blue-600 dark:text-blue-400 align-text-bottom" /> at the bottom of Safari</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">2.</span>
                  <span>Scroll down and tap <strong className="text-slate-900 dark:text-white">"Add to Home Screen"</strong> <PlusSquare className="inline h-3.5 w-3.5 mx-1 text-slate-700 dark:text-slate-300 align-text-bottom" /></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">3.</span>
                  <span>Tap <strong className="text-slate-900 dark:text-white">Add</strong> in the top right. CardBase AI is now on your home screen!</span>
                </li>
              </ol>
            </div>

            {/* Android Instructions */}
            <div className={`p-4 rounded-2xl border transition-all ${
              platform === 'android' && !deferredPrompt
                ? 'border-blue-500 bg-blue-50/40 dark:bg-[#0e162a] ring-1 ring-blue-500/30' 
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070b14]'
            }`}>
              <div className="flex items-center space-x-2 font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-2.5">
                <Chrome className="h-4 w-4 text-emerald-600" />
                <span>Android (Chrome / Samsung Internet)</span>
                {platform === 'android' && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    Your Device
                  </span>
                )}
              </div>
              <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 shrink-0">1.</span>
                  <span>Tap the <strong className="text-slate-900 dark:text-white">three dots menu (⋮)</strong> in Chrome top-right</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 shrink-0">2.</span>
                  <span>Tap <strong className="text-slate-900 dark:text-white">"Install app"</strong> or <strong className="text-slate-900 dark:text-white">"Add to Home screen"</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 shrink-0">3.</span>
                  <span>Confirm and open CardBase directly like any native Play Store app</span>
                </li>
              </ol>
            </div>

          </div>

          {/* Benefits Bullet Points */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Full Screen Camera</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Zero App Store downloads</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Offline Tesseract OCR</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Direct iOS/Android vCard export</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#0b1120]/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            PWA Progressive Mobile Web App
          </span>
          <button
            onClick={onClose}
            className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
