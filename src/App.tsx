import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Camera,
  Layers,
  Share2,
  ShieldCheck,
  Download,
  Search,
  Wifi,
  WifiOff,
  CheckCircle2,
  Plus,
  RefreshCw,
  Sliders,
  TrendingUp,
  FileSpreadsheet,
  Globe,
  Database
} from 'lucide-react';
import { ContactCard, CRMConfig, CRMProvider, CategoryConfig, UserBillingState } from './types';
import {
  loadCardsFromStorage,
  saveCardsToStorage,
  loadCrmConfigs,
  saveCrmConfigs,
  loadSettings,
  saveSettings,
  loadCategoriesFromStorage,
  saveCategoriesToStorage,
  resetCategoriesToDefault,
  loadBilling,
  saveBilling,
  consumeScanQuota,
  checkCanScanCards,
  AppSettings
} from './utils/storage';
import { exportToCSV, exportToVCF, printCards } from './utils/exportUtils';
import { generateSampleCardSvg } from './utils/sampleCards';
import { Navbar } from './components/Navbar';
import { BatchScanner } from './components/BatchScanner';
import { CameraScanner } from './components/CameraScanner';
import { CardGrid } from './components/CardGrid';
import { CardDetailModal } from './components/CardDetailModal';
import { QrCodeModal } from './components/QrCodeModal';
import { CrmSyncModal } from './components/CrmSyncModal';
import { BackupModal } from './components/BackupModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { DesignGalleryModal } from './components/DesignGalleryModal';
import { InstallAppModal } from './components/InstallAppModal';
import { PricingModal } from './components/PricingModal';

export const App: React.FC = () => {
  // App Persistent State
  const [cards, setCards] = useState<ContactCard[]>(() => loadCardsFromStorage());
  const [categories, setCategories] = useState<CategoryConfig[]>(() => loadCategoriesFromStorage());
  const [crmConfigs, setCrmConfigs] = useState<CRMConfig[]>(() => loadCrmConfigs());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [billing, setBilling] = useState<UserBillingState>(() => loadBilling());

  // Modal State Triggers
  const [isBatchScannerOpen, setIsBatchScannerOpen] = useState(false);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);
  const [isCrmSyncOpen, setIsCrmSyncOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isDesignGalleryOpen, setIsDesignGalleryOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [pricingTriggerReason, setPricingTriggerReason] = useState<string | undefined>(undefined);
  const [selectedCardForDetail, setSelectedCardForDetail] = useState<ContactCard | null>(null);
  const [selectedCardForQr, setSelectedCardForQr] = useState<ContactCard | null>(null);

  // Network Offline Status
  const [isSystemOffline, setIsSystemOffline] = useState(!navigator.onLine);
  const [forceOfflineMode, setForceOfflineMode] = useState(false);

  const effectiveOffline = isSystemOffline || forceOfflineMode;

  // Sync cards, categories, billing and settings changes to LocalStorage
  useEffect(() => {
    saveCardsToStorage(cards);
  }, [cards]);

  useEffect(() => {
    saveCategoriesToStorage(categories);
  }, [categories]);

  useEffect(() => {
    saveCrmConfigs(crmConfigs);
  }, [crmConfigs]);

  useEffect(() => {
    saveBilling(billing);
  }, [billing]);

  useEffect(() => {
    saveSettings(settings);
    // Dark mode DOM class
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsSystemOffline(false);
    const handleOffline = () => setIsSystemOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Safe Scanner Launchers with Quota Guard
  const handleOpenBatchScanner = () => {
    const check = checkCanScanCards(1, billing);
    if (!check.allowed) {
      setPricingTriggerReason(check.reason);
      setIsPricingOpen(true);
      return;
    }
    setPricingTriggerReason(undefined);
    setIsBatchScannerOpen(true);
  };

  const handleOpenSingleScanner = () => {
    const check = checkCanScanCards(1, billing);
    if (!check.allowed) {
      setPricingTriggerReason(check.reason);
      setIsPricingOpen(true);
      return;
    }
    setPricingTriggerReason(undefined);
    setIsCameraScannerOpen(true);
  };

  // Card Mutators with Automatic Scan Quota Consumption
  const handleSaveBatchCards = (newCards: ContactCard[]) => {
    setCards((prev) => [...newCards, ...prev]);
    setBilling((prev) => consumeScanQuota(newCards.length, prev));
  };

  const handleSaveSingleCard = (newCard: ContactCard) => {
    setCards((prev) => [newCard, ...prev]);
    setBilling((prev) => consumeScanQuota(1, prev));
  };

  const handleAddNewManualCard = () => {
    const now = new Date().toISOString();
    const newCard: ContactCard = {
      id: 'manual_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      fullName: 'New Contact',
      jobTitle: '',
      company: '',
      email: '',
      phone: '',
      address: { full: '' },
      website: '',
      category: 'General',
      tags: ['Manual Entry'],
      notes: '',
      social: {},
      cardImage: generateSampleCardSvg('New Contact', 'Title', 'Company', 'email@example.com', '+1 (555) 000-0000', 'example.com'),
      confidenceScore: 100,
      scannedAt: now,
      updatedAt: now,
      isFavorite: false,
      crmSyncStatus: {},
    };
    setSelectedCardForDetail(newCard);
  };

  const handleUpdateCard = (updatedCard: ContactCard) => {
    setCards((prev) => {
      const exists = prev.some((c) => c.id === updatedCard.id);
      if (exists) {
        return prev.map((c) => (c.id === updatedCard.id ? updatedCard : c));
      } else {
        return [updatedCard, ...prev];
      }
    });
    if (selectedCardForDetail?.id === updatedCard.id) {
      setSelectedCardForDetail(updatedCard);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    if (selectedCardForDetail?.id === cardId) {
      setSelectedCardForDetail(null);
    }
  };

  const handleBulkDelete = (cardIds: string[]) => {
    setCards((prev) => prev.filter((c) => !cardIds.includes(c.id)));
  };

  const handleToggleFavorite = (card: ContactCard) => {
    handleUpdateCard({ ...card, isFavorite: !card.isFavorite });
  };

  const handlePushToCrm = async (card: ContactCard, provider: CRMProvider) => {
    try {
      const response = await fetch('/api/crm/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          contacts: [card],
        }),
      });
      const data = await response.json();
      if (data.success) {
        const updated: ContactCard = {
          ...card,
          crmSyncStatus: {
            ...card.crmSyncStatus,
            [provider]: {
              synced: true,
              syncedAt: new Date().toISOString(),
              remoteId: `${provider.toLowerCase()}_${Date.now()}`,
              provider,
            },
          },
        };
        handleUpdateCard(updated);
      }
    } catch (err) {
      console.error('CRM push error:', err);
    }
  };

  const handleBulkCrmSync = (cardIds: string[], provider: CRMProvider) => {
    setIsCrmSyncOpen(true);
  };

  // Re-label cards when a category name changes or is deleted
  const handleUpdateCardCategory = (oldCategoryName: string, newCategoryName: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.category === oldCategoryName) {
          return { ...c, category: newCategoryName };
        }
        return c;
      })
    );
  };

  // Metrics
  const totalCards = cards.length;
  const syncedCardsCount = cards.filter((c) =>
    (Object.values(c.crmSyncStatus || {}) as any[]).some((s) => Boolean(s?.synced))
  ).length;
  const avgConfidence = totalCards
    ? Math.round(cards.reduce((acc, c) => acc + c.confidenceScore, 0) / totalCards)
    : 98;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      
      {/* Navigation Header */}
      <Navbar
        cards={cards}
        selectedCards={[]}
        cardCount={totalCards}
        onOpenBatchScanner={handleOpenBatchScanner}
        onOpenSingleScanner={handleOpenSingleScanner}
        onOpenCameraScanner={handleOpenSingleScanner}
        onOpenCrmModal={() => setIsCrmSyncOpen(true)}
        onOpenCrmSync={() => setIsCrmSyncOpen(true)}
        onOpenBackupModal={() => setIsBackupOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
        onOpenDesignGallery={() => setIsDesignGalleryOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenPricingModal={() => {
          setPricingTriggerReason(undefined);
          setIsPricingOpen(true);
        }}
        billing={billing}
        onAddNewManualCard={handleAddNewManualCard}
        darkMode={settings.darkMode}
        onToggleDarkMode={() =>
          setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }))
        }
        isOffline={effectiveOffline}
        onToggleOfflineSim={() => setForceOfflineMode((prev) => !prev)}
        onToggleOfflineMode={() => setForceOfflineMode((prev) => !prev)}
        onExportCSV={() => exportToCSV(cards)}
        onExportVCF={() => exportToVCF(cards)}
        onPrint={() => printCards(cards)}
      />

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Offline Banner Notification */}
        {effectiveOffline && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2.5">
              <WifiOff className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                <strong>Offline Mode Active:</strong> Business card scanning will utilize client-side OCR (Tesseract.js) without contacting external AI cloud servers.
              </span>
            </div>
            <button
              onClick={() => setForceOfflineMode(false)}
              className="text-[11px] font-bold text-amber-700 dark:text-amber-300 underline shrink-0 cursor-pointer"
            >
              Switch to Online Gemini AI
            </button>
          </div>
        )}

        {/* Quota / Billing Plan Indicator Strip */}
        {!billing.isSubscribed && (
          <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-transparent border border-blue-200 dark:border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="h-8 w-8 rounded-xl bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  Free Starter Account:
                </span>{' '}
                <span className="text-slate-600 dark:text-slate-300">
                  {billing.freeCardsUsed} / {billing.freeCardsLimit} cards used ({Math.max(0, billing.freeCardsLimit - billing.freeCardsUsed)} remaining)
                  {billing.purchasedCredits > 0 && ` + ${billing.purchasedCredits} Event Pass credits`}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  setPricingTriggerReason(undefined);
                  setIsPricingOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xs transition-all cursor-pointer flex items-center space-x-1"
              >
                <span>Upgrade / Event Passes</span>
              </button>
            </div>
          </div>
        )}

        {/* Executive Metrics & Action Callouts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Metric 1: Total Digitize Cards */}
          <div className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500">Digitized Cards</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {totalCards}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Secure local vault</div>
            </div>
            <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Layers className="h-5 w-5" />
            </div>
          </div>

          {/* Metric 2: 1-Pic-10-Cards Batch Accelerator */}
          <div
            onClick={handleOpenBatchScanner}
            className="p-4.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 flex items-center justify-between cursor-pointer hover:opacity-95 transition-opacity"
          >
            <div>
              <div className="text-xs font-bold text-blue-100 uppercase tracking-wider flex items-center">
                <Sparkles className="h-3.5 w-3.5 mr-1" /> 1-Pic 10 Cards
              </div>
              <div className="text-sm font-extrabold mt-1">Batch OCR Scanner</div>
              <div className="text-[11px] text-blue-100/90 mt-0.5">Rapid pile digitization ➔</div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold">
              <Plus className="h-5 w-5" />
            </div>
          </div>

          {/* Metric 3: CRM Synchronization Gateway */}
          <div
            onClick={() => setIsCrmSyncOpen(true)}
            className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-colors"
          >
            <div>
              <div className="text-xs font-semibold text-slate-500">CRM Pipeline</div>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {syncedCardsCount} <span className="text-xs font-semibold text-slate-400">/ {totalCards} synced</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">HubSpot • Salesforce • Zoho</div>
            </div>
            <div className="h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Share2 className="h-5 w-5" />
            </div>
          </div>

          {/* Metric 4: OCR Precision & Privacy Vault */}
          <div
            onClick={() => setIsBackupOpen(true)}
            className="p-4.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-sky-300 transition-colors"
          >
            <div>
              <div className="text-xs font-semibold text-slate-500">Vault Privacy &amp; Backup</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center">
                {avgConfidence}% <span className="text-xs font-normal text-emerald-500 ml-1.5 font-bold">OCR Acc</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">AES-256 GCM Encrypted</div>
            </div>
            <div className="h-11 w-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>

        </div>

        {/* Card Gallery Workspace */}
        <CardGrid
          cards={cards}
          categoriesList={categories}
          onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
          onCardClick={(card) => setSelectedCardForDetail(card)}
          onToggleFavorite={handleToggleFavorite}
          onOpenQr={(card) => setSelectedCardForQr(card)}
          onPushToCrm={handlePushToCrm}
          onBulkDelete={handleBulkDelete}
          onBulkCrmSync={handleBulkCrmSync}
          onOpenBatchScanner={handleOpenBatchScanner}
          onOpenCameraScanner={handleOpenSingleScanner}
          privacyMode={settings.privacyMode}
        />

      </main>

      {/* 1-Pic-10-Cards Batch Scanner Modal */}
      <BatchScanner
        isOpen={isBatchScannerOpen}
        onClose={() => setIsBatchScannerOpen(false)}
        onSaveCards={handleSaveBatchCards}
        isOffline={effectiveOffline}
      />

      {/* Single Card Live Camera Scanner Modal */}
      <CameraScanner
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onSaveCard={handleSaveSingleCard}
        isOffline={effectiveOffline}
      />

      {/* Card Detail & Editing Modal */}
      <CardDetailModal
        card={selectedCardForDetail}
        categoriesList={categories}
        onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
        isOpen={!!selectedCardForDetail}
        onClose={() => setSelectedCardForDetail(null)}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
        onOpenQrCode={(card) => setSelectedCardForQr(card)}
        onPushToCrm={handlePushToCrm}
        privacyMode={settings.privacyMode}
      />

      {/* vCard Live QR Modal */}
      <QrCodeModal
        card={selectedCardForQr}
        isOpen={!!selectedCardForQr}
        onClose={() => setSelectedCardForQr(null)}
      />

      {/* CRM Gateway Configuration Modal */}
      <CrmSyncModal
        isOpen={isCrmSyncOpen}
        onClose={() => setIsCrmSyncOpen(false)}
        crmConfigs={crmConfigs}
        onUpdateCrmConfigs={(configs) => setCrmConfigs(configs)}
        cards={cards}
        onCardsSynced={(updated) => setCards(updated)}
      />

      {/* End-to-End Encrypted Cloud Backup & Privacy Center Modal */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        cards={cards}
        onRestoreCards={(restored) => setCards(restored)}
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings(newSettings)}
      />

      {/* Category Manager & Customizer Modal */}
      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        cards={cards}
        onSaveCategories={(updatedCats) => setCategories(updatedCats)}
        onUpdateCardCategory={handleUpdateCardCategory}
        onResetCategories={() => setCategories(resetCategoriesToDefault())}
      />

      {/* 5 Design Options & Visual Mockups Showcase Gallery */}
      <DesignGalleryModal
        isOpen={isDesignGalleryOpen}
        onClose={() => setIsDesignGalleryOpen(false)}
      />

      {/* Mobile App Download & Install Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Hybrid Pricing & Event Pass Hub Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => {
          setIsPricingOpen(false);
          setPricingTriggerReason(undefined);
        }}
        billing={billing}
        onBillingUpdated={(updated) => setBilling(updated)}
        triggerReason={pricingTriggerReason}
      />

    </div>
  );
};

export default App;
