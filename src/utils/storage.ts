import { ContactCard, CRMConfig, CategoryConfig, UserBillingState, SubscriptionPlanType, CreditPackType } from '../types';
import { INITIAL_SAMPLE_CARDS, DEFAULT_CATEGORIES } from './sampleCards';

const STORAGE_KEY_CARDS = 'cardsnap_contacts_v3';
const STORAGE_KEY_CATEGORIES = 'cardsnap_categories_v3';
const STORAGE_KEY_CRM = 'cardsnap_crm_config_v1';
const STORAGE_KEY_SETTINGS = 'cardsnap_settings_v1';
const STORAGE_KEY_OFFLINE_QUEUE = 'cardsnap_offline_queue_v1';
const STORAGE_KEY_BILLING = 'cardsnap_user_billing_v1';

export const DEFAULT_BILLING: UserBillingState = {
  plan: 'free',
  isSubscribed: false,
  freeCardsLimit: 20,
  freeCardsUsed: 14, // Initial realistic state for sample library demo
  purchasedCredits: 0,
  totalCardsScanned: 14,
};

export interface AppSettings {
  darkMode: boolean;
  privacyMode: boolean; // Masks sensitive emails/phones in preview
  autoCloudBackup: boolean;
  cloudSyncKey: string;
  lastCloudBackup?: string;
  defaultExportFormat: 'vcf' | 'csv';
}

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  privacyMode: false,
  autoCloudBackup: true,
  cloudSyncKey: 'cardsnap_vault_master',
  defaultExportFormat: 'vcf',
};

const DEFAULT_CRM_CONFIGS: CRMConfig[] = [
  {
    provider: 'HubSpot',
    name: 'HubSpot CRM',
    connected: true,
    apiKey: 'pat-na1-39294-sample-hubspot-token',
    portalId: '2981029',
    autoSyncOnScan: true,
    lastSyncAt: new Date().toISOString(),
    fieldMapping: {
      nameField: 'firstname,lastname',
      companyField: 'company',
      emailField: 'email',
      phoneField: 'phone',
      titleField: 'jobtitle',
    },
  },
  {
    provider: 'Salesforce',
    name: 'Salesforce Sales Cloud',
    connected: true,
    apiKey: '00D50000000Ixxxxxx!AQ0AQ.sample.salesforce',
    autoSyncOnScan: false,
    lastSyncAt: new Date().toISOString(),
    fieldMapping: {
      nameField: 'Name',
      companyField: 'Account.Name',
      emailField: 'Email',
      phoneField: 'Phone',
      titleField: 'Title',
    },
  },
  {
    provider: 'Zoho',
    name: 'Zoho CRM',
    connected: false,
    apiKey: '',
    autoSyncOnScan: false,
    fieldMapping: {
      nameField: 'Full_Name',
      companyField: 'Company',
      emailField: 'Email',
      phoneField: 'Phone',
      titleField: 'Designation',
    },
  },
  {
    provider: 'GoogleContacts',
    name: 'Google Contacts Workspace',
    connected: true,
    apiKey: 'ya29.sample-oauth-gcontacts',
    autoSyncOnScan: true,
    lastSyncAt: new Date().toISOString(),
    fieldMapping: {
      nameField: 'names.givenName',
      companyField: 'organizations.name',
      emailField: 'emailAddresses.value',
      phoneField: 'phoneNumbers.value',
      titleField: 'organizations.title',
    },
  },
  {
    provider: 'Pipedrive',
    name: 'Pipedrive CRM',
    connected: false,
    apiKey: '',
    autoSyncOnScan: false,
    fieldMapping: {
      nameField: 'name',
      companyField: 'org_id',
      emailField: 'email',
      phoneField: 'phone',
      titleField: 'job_title',
    },
  },
  {
    provider: 'Notion',
    name: 'Notion Contacts Database',
    connected: false,
    apiKey: '',
    autoSyncOnScan: false,
    fieldMapping: {
      nameField: 'Name',
      companyField: 'Company',
      emailField: 'Email',
      phoneField: 'Phone',
      titleField: 'Role',
    },
  },
];

export function getSavedCards(): ContactCard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CARDS);
    if (!raw) {
      // Seed with initial 20 sample cards on first run
      saveCards(INITIAL_SAMPLE_CARDS);
      return INITIAL_SAMPLE_CARDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveCards(INITIAL_SAMPLE_CARDS);
    return INITIAL_SAMPLE_CARDS;
  } catch (err) {
    console.error('Failed to load cards from storage:', err);
    return INITIAL_SAMPLE_CARDS;
  }
}

export function resetToSampleCards(): ContactCard[] {
  saveCards(INITIAL_SAMPLE_CARDS);
  return INITIAL_SAMPLE_CARDS;
}

export function saveCards(cards: ContactCard[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cards));
  } catch (err) {
    console.error('Failed to save cards to storage:', err);
  }
}

export function getSavedCategories(): CategoryConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) {
      saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  } catch (err) {
    console.error('Failed to load categories from storage:', err);
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: CategoryConfig[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories to storage:', err);
  }
}

export function resetCategoriesToDefault(): CategoryConfig[] {
  saveCategories(DEFAULT_CATEGORIES);
  return DEFAULT_CATEGORIES;
}

export function getCrmConfigs(): CRMConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CRM);
    if (!raw) {
      saveCrmConfigs(DEFAULT_CRM_CONFIGS);
      return DEFAULT_CRM_CONFIGS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CRM_CONFIGS;
  }
}

export function saveCrmConfigs(configs: CRMConfig[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CRM, JSON.stringify(configs));
  } catch (err) {
    console.error('Failed to save CRM configs:', err);
  }
}

export function getAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save app settings:', err);
  }
}

export function getOfflineQueue(): Array<{ id: string; imageData: string; timestamp: string }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OFFLINE_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToOfflineQueue(item: { id: string; imageData: string; timestamp: string }): void {
  try {
    const queue = getOfflineQueue();
    queue.push(item);
    localStorage.setItem(STORAGE_KEY_OFFLINE_QUEUE, JSON.stringify(queue));
  } catch (err) {
    console.error('Failed to add to offline queue:', err);
  }
}

export function clearOfflineQueue(): void {
  localStorage.removeItem(STORAGE_KEY_OFFLINE_QUEUE);
}

export function getUserBilling(): UserBillingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BILLING);
    if (!raw) {
      saveUserBilling(DEFAULT_BILLING);
      return DEFAULT_BILLING;
    }
    return { ...DEFAULT_BILLING, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_BILLING;
  }
}

export function saveUserBilling(billing: UserBillingState): void {
  try {
    localStorage.setItem(STORAGE_KEY_BILLING, JSON.stringify(billing));
  } catch (err) {
    console.error('Failed to save user billing:', err);
  }
}

export function checkCanScanCards(
  requestedCount: number,
  billing: UserBillingState
): { allowed: boolean; remainingQuota: number; reason?: string } {
  if (billing.isSubscribed) {
    return { allowed: true, remainingQuota: Infinity };
  }

  const freeRemaining = Math.max(0, billing.freeCardsLimit - billing.freeCardsUsed);
  const totalAvailable = freeRemaining + billing.purchasedCredits;

  if (totalAvailable >= requestedCount) {
    return { allowed: true, remainingQuota: totalAvailable };
  }

  return {
    allowed: false,
    remainingQuota: totalAvailable,
    reason: `You have ${totalAvailable} card scan${totalAvailable === 1 ? '' : 's'} available (Limit: 20 free cards). You need ${requestedCount}. Upgrade to Pro Unlimited or grab an Event Pass to continue scanning.`
  };
}

export function consumeScanQuota(count: number, billing: UserBillingState): UserBillingState {
  if (billing.isSubscribed) {
    return {
      ...billing,
      totalCardsScanned: billing.totalCardsScanned + count,
    };
  }

  let remainingToDeduct = count;
  let newFreeUsed = billing.freeCardsUsed;
  let newPurchasedCredits = billing.purchasedCredits;

  // First consume free quota up to freeCardsLimit
  const availableFree = Math.max(0, billing.freeCardsLimit - newFreeUsed);
  const freeDeduction = Math.min(availableFree, remainingToDeduct);
  newFreeUsed += freeDeduction;
  remainingToDeduct -= freeDeduction;

  // Next consume purchased event pass credits
  if (remainingToDeduct > 0) {
    const creditsDeduction = Math.min(newPurchasedCredits, remainingToDeduct);
    newPurchasedCredits -= creditsDeduction;
    remainingToDeduct -= creditsDeduction;
  }

  const updated: UserBillingState = {
    ...billing,
    freeCardsUsed: newFreeUsed,
    purchasedCredits: newPurchasedCredits,
    totalCardsScanned: billing.totalCardsScanned + count,
  };

  saveUserBilling(updated);
  return updated;
}

export function upgradeToSubscription(
  plan: 'pro_monthly' | 'pro_annual',
  current: UserBillingState
): UserBillingState {
  const updated: UserBillingState = {
    ...current,
    plan,
    isSubscribed: true,
    subscribedAt: new Date().toISOString(),
    billingCycleEnd: new Date(Date.now() + (plan === 'pro_annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
    lastPurchaseDate: new Date().toISOString(),
    lastPurchaseDescription: plan === 'pro_annual' ? 'Pro Annual Plan ($29.99/year)' : 'Pro Monthly Plan ($4.99/month)',
  };
  saveUserBilling(updated);
  return updated;
}

export function purchaseCreditPack(
  pack: CreditPackType,
  current: UserBillingState
): UserBillingState {
  const creditsMap: Record<CreditPackType, { count: number; name: string; price: string }> = {
    pack_50: { count: 50, name: 'Expo Starter Pass (50 Cards)', price: '$4.99' },
    pack_200: { count: 200, name: 'Summit Pass (200 Cards)', price: '$12.99' },
    pack_1000: { count: 1000, name: 'Executive Enterprise Pass (1,000 Cards)', price: '$39.99' },
  };

  const packInfo = creditsMap[pack];
  const updated: UserBillingState = {
    ...current,
    purchasedCredits: current.purchasedCredits + packInfo.count,
    lastPurchaseDate: new Date().toISOString(),
    lastPurchaseDescription: `${packInfo.name} (${packInfo.price})`,
  };
  saveUserBilling(updated);
  return updated;
}

export function resetBillingToFree(current: UserBillingState): UserBillingState {
  const updated: UserBillingState = {
    ...current,
    plan: 'free',
    isSubscribed: false,
    freeCardsUsed: 0,
    purchasedCredits: 0,
  };
  saveUserBilling(updated);
  return updated;
}

// Aliases for convenience
export const loadCardsFromStorage = getSavedCards;
export const saveCardsToStorage = saveCards;
export const loadCategoriesFromStorage = getSavedCategories;
export const saveCategoriesToStorage = saveCategories;
export const loadCrmConfigs = getCrmConfigs;
export const loadSettings = getAppSettings;
export const saveSettings = saveAppSettings;
export const loadBilling = getUserBilling;
export const saveBilling = saveUserBilling;
