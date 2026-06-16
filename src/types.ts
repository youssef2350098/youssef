/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'ar';
export type AppTheme = 'cyber' | 'glass' | 'neon';

export interface Revenue {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
  attachment?: string; // base64 or file name info
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  supplier: string;
  notes: string;
}

export interface Investment {
  id: string;
  projectName: string;
  investmentValue: number;
  expectedReturn: number;
  actualReturn: number;
  status: 'planning' | 'active' | 'matured' | 'completed';
  notes: string;
}

export interface Client {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  service: string;
  dealValue: number;
  status: 'lead' | 'contacted' | 'negotiating' | 'active' | 'completed' | 'on-hold';
  notes: string;
  lastFollowUp: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  basePrice: number;
  activeOrders: number;
  totalEarned: number;
  isFuture: boolean;
  category: 'core' | 'future';
  icon: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  clientName: string;
  budget: number;
  deadline: string;
  status: 'briefing' | 'production' | 'review' | 'delivered';
  revenueForecast: number;
  currentProgress: number; // 0 to 100
}

export interface ContentItem {
  id: string;
  title: string;
  script: string;
  productionStatus: 'idea' | 'writing' | 'production' | 'editing' | 'published';
  publishingDate: string;
  voiceNotes: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube' | 'Facebook';
}

export interface SewingPattern {
  id: string;
  name: string;
  category: 'caftan' | 'jellaba' | 'dress' | 'shirt' | 'pants' | 'children';
  measurements: {
    bust?: number;
    waist?: number;
    hips?: number;
    length?: number;
    shoulder?: number;
    sleeve?: number;
  };
  notes: string;
  imageSim?: string; // custom design sketch URI
  pdfName?: string;
  pdfSimContent?: string;
}

export interface Goal {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  target: number;
  current: number;
  unit: string;
  deadline: string;
  completed: boolean;
  notes?: string; // Optional notes for the goal
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  category: string;
  notes: string;
}

export interface SocialMediaStats {
  platform: 'TikTok' | 'Instagram' | 'YouTube' | 'Facebook';
  followers: number;
  reach: number;
  engagement: number;
  revenue: number;
}

export interface DatabaseBackup {
  id: string;
  timestamp: string;
  backupType: 'auto' | 'manual';
  fileName: string;
  recordCount: number;
}

// Full translation dictionary
export const TRANSLATIONS = {
  en: {
    appTitle: 'FOXNEX',
    appSubtitle: 'Premium Creative Command Center',
    commandCenter: 'COMMAND CENTER',
    dashboard: 'Dashboard',
    revenue: 'Revenue Management',
    expenses: 'Expenses Center',
    investments: 'Investments Workspace',
    clients: 'Client CRM',
    services: 'Service Catalog',
    patterns: 'Sewing Patterns',
    goals: 'Goals Center',
    projects: 'Projects Hub',
    content: 'Content & Scripts',
    social: 'Social Analytics',
    settings: 'System Preferences',
    backup: 'Database Backups',
    security: 'Security Hub',
    
    // Command Center
    totalRevenue: 'Total Revenue',
    totalExpenses: 'Total Expenses',
    netProfit: 'Net Profit',
    growthRate: 'Growth Progress',
    liveHQ: 'HQ Core Hologram',
    quickNav: 'Click a spinning 3D module node to teleport to workspace.',
    enterPin: 'Enter security PIN to override system lock',
    setupPin: 'Setup your Master Security PIN',
    incorrectPin: 'Access Denied: Invalid Security Passcode!',
    lockSystem: 'Lock Console',
    systemLocked: 'SECURITY PROTOCOL ENGAGED',
    
    // Buttons & Actions
    addRecord: 'Add New Record',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    save: 'Save Changes',
    search: 'Search databases...',
    filter: 'Filter by',
    all: 'All',
    exportPDF: 'Export Reports (PDF)',
    exportExcel: 'Export Backup (Excel/JSON)',
    restoreBackup: 'Restore Backup Database',
    generateBackup: 'Trigger Database Backup',
    
    // Statuses
    planning: 'Planning',
    active: 'Active Strategy',
    matured: 'Matured',
    completed: 'Completed Successfully',
    lead: 'Lead Prospect',
    contacted: 'First Contact',
    negotiating: 'Negotiation',
    completed_crm: 'Closed Won',
    onhold: 'On Hold',
    
    // Sewing Pattern Fields
    patternCatalog: 'Pattern Design Catalog',
    measurements: 'Standard Tailoring Measurements (cm)',
    bust: 'Bust Width',
    waist: 'Waist circumference',
    hips: 'Hips width',
    length: 'Overall caftan length',
    shoulder: 'Shoulder-to-shoulder',
    sleeve: 'Sleeve Length',
    notes: 'Stitching notes and fabric suggestions',

    // Content status
    idea: 'Idea Concept',
    writing: 'Script Writing',
    production: 'Camera Filming',
    editing: 'Post-Production',
    published: 'Live Streamed',

    // Themes
    cyber: 'Cyberpunk Purple Glow',
    glass: 'Apple Vision Glass',
    neon: 'Tesla Neon Grid',

    // Alert
    backupSuccess: 'Database synced and local JSON state mirrored successfully!',
    backupRestored: 'Database state restored from the local point-in-time image!',
  },
  ar: {
    appTitle: 'فوكسنيكس لشركاء الهوية (FOXNEX)',
    appSubtitle: 'مركز قيادة الأزياء والتصميم التفاعلي',
    commandCenter: 'منصة التحكم ثلاثية الأبعاد',
    dashboard: 'لوحة التحكم',
    revenue: 'إدارة الإيرادات',
    expenses: 'مركز المصاريف',
    investments: 'ملف الاستثمارات',
    clients: 'علاقات العملاء CRM',
    services: 'خدماتنا ومنتجاتنا',
    patterns: 'مكتبة الباترونات والخياطة',
    goals: 'مركز الأهداف الاستراتيجية',
    projects: 'إدارة المشاريع',
    content: 'المحتوى والسيناريوهات',
    social: 'التحليلات الاجتماعية',
    settings: 'إعدادات النظام الأسية',
    backup: 'نسخ احتياطي للبيانات',
    security: 'بوابة الحماية والمصادقة',
    
    // Command Center
    totalRevenue: 'إجمالي الإيرادات',
    totalExpenses: 'إجمالي المصاريف',
    netProfit: 'صافي الأرباح المكتسبة',
    growthRate: 'معدل النمو المتوقع',
    liveHQ: 'الهولوجرام الرئيسي لمركز القيادة',
    quickNav: 'انقر فوق أي بوابة هولوجرام طافية للانتقال الفوري إلى بيئة العمل.',
    enterPin: 'أدخل رمز المرور الأمني لفتح لوحة التحكم',
    setupPin: 'إنشاء رمز المرور الرئيسي الآمن للنظام',
    incorrectPin: 'تم رفض الدخول: رمز المرور غير صحيح!',
    lockSystem: 'تأمين لوحة التحكم',
    systemLocked: 'تم تفعيل بروتوكول الحماية الأمنية',
    
    // Buttons & Actions
    addRecord: 'إضافة سجل جديد المدى',
    edit: 'تعديل السجل',
    delete: 'حذف',
    cancel: 'إلغاء الأمر',
    save: 'حفظ التحديثات',
    search: 'البحث في قاعدة البيانات...',
    filter: 'تصفية حسب',
    all: 'عرض الكل',
    exportPDF: 'تصدير التقارير (PDF)',
    exportExcel: 'تصدير نسخة احتياطية (Excel/JSON)',
    restoreBackup: 'استعادة النسخة الاحتياطية',
    generateBackup: 'إنشاء نقطة استعادة فورية',
    
    // Statuses
    planning: 'قيد التخطيط',
    active: 'نشط ويعمل حالياً',
    matured: 'مستحق بالكامل',
    completed: 'مكتمل بنجاح',
    lead: 'عميل محتمل جديد',
    contacted: 'تم الاتصال بالعميل',
    negotiating: 'مفاوضات جارية',
    completed_crm: 'صفقة رابحة مغلقة',
    onhold: 'متوقف مؤقتاً',
    
    // Sewing Pattern Fields
    patternCatalog: 'مكتبة تصميم الباترونات المعتمدة',
    measurements: 'مقاسات التفصيل القياسية بالسنتمتر (cm)',
    bust: 'محيط الصدر الرئيسي',
    waist: 'محيط الخصر والدوران',
    hips: 'محيط الأوراك والمؤخرة',
    length: 'الطول الكلي للقفطان',
    shoulder: 'عرض الكتف إلى الكتف',
    sleeve: 'طول الأكمام',
    notes: 'تعليمات الخياطة ونوعية الأقمشة المقترحة',

    // Content status
    idea: 'فكرة محتوى',
    writing: 'كتابة السيناريو الإبداعي',
    production: 'التصوير السينمائي',
    editing: 'المونتاج والمؤثرات',
    published: 'تم النشر والبث',

    // Themes
    cyber: 'الوهج السيبراني الأرجواني',
    glass: 'زجاج آبل فيجن برو النقي',
    neon: 'شبكة تسلا النيون المستقبيلية',

    // Alert
    backupSuccess: 'تمت مزامنة قواعد البيانات بنجاح محلياً وتصدير ملف JSON!',
    backupRestored: 'تم استرداد بيانات النظام بالكامل من صورة الحفظ المحددة!',
  }
};
