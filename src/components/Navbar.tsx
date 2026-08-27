import React from 'react';
import {
  Layers,
  Camera,
  Share2,
  Cloud,
  Moon,
  Sun,
  Database,
  Plus,
  Shield,
  Wifi,
  WifiOff,
  Download,
  FileSpreadsheet,
  Contact,
  Printer,
  Tag,
  Palette,
  Sparkles,
  Smartphone,
  Crown,
  Ticket
} from 'lucide-react';
import { ContactCard, UserBillingState } from '../types';
import { exportToCSV, exportToVCF, printContactSheet } from '../utils/exportUtils';

interface NavbarProps {
  cards?: ContactCard[];
  cardCount?: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isOffline: boolean;
  onToggleOfflineSim?: () => void;
  onToggleOfflineMode?: () => void;
  onOpenBatchScanner: () => void;
  onOpenSingleScanner?: () => void;
  onOpenCameraScanner?: () => void;
  onOpenCrmModal?: () => void;
  onOpenCrmSync?: () => void;
  onOpenBackupModal?: () => void;
  onOpenBackup?: () => void;
  onOpenCategoryManager?: () => void;
  onOpenDesignGallery?: () => void;
  onOpenInstallModal?: () => void;
  onOpenPricingModal?: () => void;
  billing?: UserBillingState;
  onAddNewManualCard?: () => void;
  selectedCards?: ContactCard[];
  onExportCSV?: () => void;
  onExportVCF?: () => void;
  onPrint?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cards = [],
  darkMode,
  onToggleDarkMode,
  isOffline,
  onToggleOfflineSim,
  onToggleOfflineMode,
  onOpenBatchScanner,
  onOpenSingleScanner,
  onOpenCameraScanner,
  onOpenCrmModal,
  onOpenCrmSync,
  onOpenBackupModal,
  onOpenBackup,
  onOpenCategoryManager,
  onOpenDesignGallery,
  onOpenInstallModal,
  onOpenPricingModal,
  billing,
  onAddNewManualCard,
  selectedCards = [],
  onExportCSV,
  onExportVCF,
  onPrint,
}) => {
  const [showExportMenu, setShowExportMenu] = React.useState(false);
  const targetCards = (selectedCards && selectedCards.length > 0) ? selectedCards : (cards || []);
  const handleSingleCamera = onOpenSingleScanner || onOpenCameraScanner;
  const handleCrmModal = onOpenCrmModal || onOpenCrmSync;
  const handleBackupModal = onOpenBackupModal || onOpenBackup;
  const handleToggleOffline = onToggleOfflineSim || onToggleOfflineMode;

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors bg-white/95 dark:bg-[#070b14]/95 border-slate-200 dark:border-slate-800/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-17 gap-2">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-slate-900 flex items-center justify-center text-white shadow-md shadow-blue-500/20 border border-white/10">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  CardBase<span className="text-blue-600 dark:text-blue-400">AI</span>
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Pro
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Executive Business Card Digitizer
              </p>
            </div>
          </div>

          {/* Center / Action Buttons (Mobile & Tablet Optimized) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-2.5 shrink-0">
            
            {/* Multi-Card Batch 1-10 Scan Button (Primary Hero Action) */}
            <button
              id="btn-batch-scan"
              onClick={onOpenBatchScanner}
              className="inline-flex items-center justify-center min-h-[42px] sm:min-h-[44px] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 active:scale-95 transition-all shadow-md shadow-blue-600/25 border border-blue-400/30 cursor-pointer"
              title="Digitize up to 10 business cards from 1 photo"
            >
              <Layers className="h-4 w-4 mr-1.5 shrink-0" />
              <span className="hidden lg:inline">1-Pic 10-Card Batch OCR</span>
              <span className="hidden sm:inline lg:hidden">10-Card Batch OCR</span>
              <span className="sm:hidden font-semibold">1-10 Batch</span>
              <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-black bg-white/20 text-white hidden xs:inline-block">
                10×
              </span>
            </button>

            {/* Single Card Camera Scan */}
            <button
              id="btn-single-camera-scan"
              onClick={handleSingleCamera}
              className="inline-flex items-center justify-center min-h-[42px] sm:min-h-[44px] px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/80 active:scale-95 transition-all border border-slate-200/80 dark:border-slate-700/80 cursor-pointer shadow-2xs"
              title="Scan single card directly with live camera"
            >
              <Camera className="h-4 w-4 sm:mr-1.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="hidden md:inline">Single Card</span>
            </button>

            {/* Pricing & Hybrid Subscription / Event Pass Hub */}
            {onOpenPricingModal && (
              <button
                id="btn-navbar-pricing"
                onClick={onOpenPricingModal}
                className="inline-flex items-center justify-center min-h-[42px] sm:min-h-[44px] px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300 bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-950/60 dark:to-amber-900/40 border border-amber-300/80 dark:border-amber-700/60 hover:from-amber-200 hover:to-amber-100 dark:hover:from-amber-900/70 active:scale-95 transition-all cursor-pointer shadow-xs"
                title="View Hybrid Pricing & Subscription Plans"
              >
                {billing?.isSubscribed ? (
                  <>
                    <Crown className="h-4 w-4 sm:mr-1.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Pro</span>
                    <span className="hidden lg:inline ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-400/30 text-amber-950 dark:text-amber-200">
                      Unlimited
                    </span>
                  </>
                ) : (billing?.purchasedCredits ?? 0) > 0 ? (
                  <>
                    <Ticket className="h-4 w-4 sm:mr-1.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{billing?.purchasedCredits}</span>
                    <span className="hidden sm:inline ml-1 text-[11px] font-medium">Credits</span>
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 sm:mr-1.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Pricing</span>
                    <span className="hidden sm:inline-block ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                      {billing ? `${Math.max(0, billing.freeCardsLimit - billing.freeCardsUsed)} left` : '20 Free'}
                    </span>
                  </>
                )}
              </button>
            )}

            {/* Mobile App Download Button */}
            {onOpenInstallModal && (
              <button
                id="btn-navbar-install-app"
                onClick={onOpenInstallModal}
                className="inline-flex items-center justify-center min-h-[42px] sm:min-h-[44px] px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="Download CardBase on your Mobile Phone"
              >
                <Smartphone className="h-4 w-4 sm:mr-1.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="hidden sm:inline">Get App</span>
              </button>
            )}

            {/* Category Customizer */}
            {onOpenCategoryManager && (
              <button
                id="btn-navbar-categories"
                onClick={onOpenCategoryManager}
                className="hidden xl:inline-flex items-center justify-center min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all border border-slate-200/80 dark:border-slate-700/80 cursor-pointer"
                title="Customize & Add Categories"
              >
                <Tag className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                Categories
              </button>
            )}

            {/* Manual Add Card */}
            {onAddNewManualCard && (
              <button
                id="btn-manual-add"
                onClick={onAddNewManualCard}
                className="hidden xl:inline-flex items-center justify-center min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all border border-slate-200/80 dark:border-slate-700/80 cursor-pointer"
                title="Add manual contact"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                Manual
              </button>
            )}

            {/* Design Options Visual Gallery */}
            {onOpenDesignGallery && (
              <button
                id="btn-navbar-design-options"
                onClick={onOpenDesignGallery}
                className="inline-flex items-center justify-center min-h-[42px] sm:min-h-[44px] px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/70 hover:bg-purple-100 dark:hover:bg-purple-900/60 active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="View 5 Design Options & Visual Mockups"
              >
                <Palette className="h-4 w-4 sm:mr-1.5 text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="hidden md:inline">Design Options</span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200">
                  5
                </span>
              </button>
            )}

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            {/* CRM Hub */}
            <button
              id="btn-crm-sync-hub"
              onClick={handleCrmModal}
              className="relative inline-flex items-center justify-center min-h-[42px] sm:min-h-[44px] p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer"
              title="CRM Integrations (HubSpot, Salesforce, Zoho, Google)"
            >
              <Share2 className="h-4 w-4 sm:mr-1.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="hidden sm:inline">CRM</span>
              <span className="ml-1.5 hidden md:inline-flex items-center px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Hub
              </span>
            </button>

            {/* Cloud Backup & Privacy */}
            <button
              id="btn-cloud-backup"
              onClick={handleBackupModal}
              className="inline-flex items-center justify-center min-h-[42px] sm:min-h-[44px] p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer"
              title="Encrypted Cloud Backup & Privacy Vault"
            >
              <Cloud className="h-4 w-4 sm:mr-1.5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="hidden lg:inline">Backup</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                id="btn-export-menu"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center justify-center min-h-[42px] sm:min-h-[44px] p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer"
                title="Export contacts to VCF, CSV, or Print"
              >
                <Download className="h-4 w-4 sm:mr-1.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0c1220] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 py-1.5 divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Export {targetCards.length} {targetCards.length === 1 ? 'Contact' : 'Contacts'}
                    </div>
                    <div className="py-1">
                      <button
                        id="export-vcf-option"
                        onClick={() => {
                          if (onExportVCF) {
                            onExportVCF();
                          } else {
                            exportToVCF(targetCards);
                          }
                          setShowExportMenu(false);
                        }}
                        className="w-full text-left px-3 py-2.5 flex items-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer min-h-[44px]"
                      >
                        <Contact className="h-4 w-4 mr-2.5 text-blue-600" />
                        <div>
                          <div className="font-medium text-xs">Export as vCard (.vcf)</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Apple Contacts, iOS, Android, Outlook</div>
                        </div>
                      </button>

                      <button
                        id="export-csv-option"
                        onClick={() => {
                          if (onExportCSV) {
                            onExportCSV();
                          } else {
                            exportToCSV(targetCards);
                          }
                          setShowExportMenu(false);
                        }}
                        className="w-full text-left px-3 py-2.5 flex items-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer min-h-[44px]"
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2.5 text-emerald-600" />
                        <div>
                          <div className="font-medium text-xs">Export as Excel / CSV</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Spreadsheets, CRM imports</div>
                        </div>
                      </button>

                      <button
                        id="export-print-option"
                        onClick={() => {
                          if (onPrint) {
                            onPrint();
                          } else {
                            printContactSheet(targetCards);
                          }
                          setShowExportMenu(false);
                        }}
                        className="w-full text-left px-3 py-2.5 flex items-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer min-h-[44px]"
                      >
                        <Printer className="h-4 w-4 mr-2.5 text-purple-600" />
                        <div>
                          <div className="font-medium text-xs">Print Contact Sheet</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">Print or save formatted PDF</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Offline Simulation / Mode Toggle */}
            <button
              id="btn-toggle-offline"
              onClick={handleToggleOffline}
              className={`min-h-[42px] sm:min-h-[44px] p-2 sm:px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer border ${
                isOffline
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isOffline ? 'Offline Mode Active (Client OCR)' : 'Online Mode (Cloud Gemini OCR)'}
            >
              {isOffline ? (
                <>
                  <WifiOff className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="hidden lg:inline ml-1">Offline</span>
                </>
              ) : (
                <Wifi className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="btn-toggle-darkmode"
              onClick={onToggleDarkMode}
              className="min-h-[42px] sm:min-h-[44px] p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
