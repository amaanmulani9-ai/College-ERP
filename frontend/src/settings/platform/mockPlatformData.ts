import {
  BrandingConfig,
  EmailTemplateItem,
  PaymentGatewayConfig,
  AIPlatformConfig,
  IntegrationAppItem,
  ERPModuleFlag,
  FeatureFlagItem,
  AutomationRuleItem,
  WebhookEndpointItem,
} from "./types";

export const MOCK_BRANDING_CONFIG: BrandingConfig = {
  logoUrl: "/assets/nits_logo.png",
  darkLogoUrl: "/assets/nits_logo_dark.png",
  faviconUrl: "/favicon.ico",
  primaryColor: "#4F46E5",
  secondaryColor: "#0EA5E9",
  accentColor: "#F59E0B",
  fontFamily: "Inter, Roboto, sans-serif",
  footerText: "© 2026 National Institute of Technology & Science. All Rights Reserved.",
  customCSS: "/* Custom ERP Theme Overrides */\n.erp-brand-header { font-weight: 800; }",
};

export const MOCK_EMAIL_TEMPLATES: EmailTemplateItem[] = [
  { id: "tpl-01", category: "Admissions", subject: "Application Received - Confirmation Code {{code}}", triggerEvent: "On Application Submit", lastUpdated: "2 days ago" },
  { id: "tpl-02", category: "Fees", subject: "Fee Due Payment Reminder - Semester {{sem}}", triggerEvent: "Scheduled Weekly", lastUpdated: "1 week ago" },
  { id: "tpl-03", category: "Payments", subject: "Payment Receipt Confirmation - Txn #{{txn_id}}", triggerEvent: "On Payment Success", lastUpdated: "Yesterday" },
  { id: "tpl-04", category: "Results", subject: "Semester Examination Results Declared", triggerEvent: "On Result Publish", lastUpdated: "3 weeks ago" },
];

export const MOCK_PAYMENT_GATEWAYS: PaymentGatewayConfig[] = [
  { id: "gw-01", name: "Razorpay Payments (UPI / Cards)", mode: "Production", isEnabled: true, apiKey: "rzp_live_889900XXXXXXXX", webhookStatus: "Healthy" },
  { id: "gw-02", name: "Stripe International Gateway", mode: "Production", isEnabled: true, apiKey: "pk_live_51M00XXXXXXXX", webhookStatus: "Healthy" },
  { id: "gw-03", name: "PayPal Express Checkout", mode: "Sandbox", isEnabled: false, apiKey: "client_id_test_99XX", webhookStatus: "Disabled" },
];

export const MOCK_AI_CONFIG: AIPlatformConfig = {
  provider: "Anthropic Claude",
  model: "claude-3-5-sonnet-20241022",
  temperature: 0.2,
  monthlyTokenQuota: 10000000,
  tokensConsumed: 2450000,
  safetyFilter: "Strict",
};

export const MOCK_INTEGRATIONS: IntegrationAppItem[] = [
  { id: "int-google", name: "Google Workspace & Directory", category: "Identity", status: "Connected", iconName: "Mail" },
  { id: "int-m365", name: "Microsoft 365 Entra ID", category: "Identity", status: "Connected", iconName: "Shield" },
  { id: "int-canvas", name: "Canvas LMS Webhook Synchronization", category: "LMS", status: "Connected", iconName: "BookOpen" },
  { id: "int-s3", name: "AWS S3 Document Storage Bucket", category: "Cloud Storage", status: "Connected", iconName: "Database" },
  { id: "int-tw", name: "Twilio SMS & Whatsapp Gateway", category: "Communication", status: "Config Needed", iconName: "MessageSquare" },
];

export const MOCK_ERP_MODULE_FLAGS: ERPModuleFlag[] = [
  { id: "mod-01", code: "MOD-STUDENTS", name: "Student Information System (SIS)", category: "Core", isEnabled: true, isBeta: false },
  { id: "mod-02", code: "MOD-FEES", name: "Fees & Payment Engine", category: "Finance", isEnabled: true, isBeta: false },
  { id: "mod-03", code: "MOD-AI", name: "AI Copilot & Analytics Assistant", category: "Intelligence", isEnabled: true, isBeta: true },
  { id: "mod-04", code: "MOD-ALUMNI", name: "Alumni Network Portal", category: "Engagement", isEnabled: true, isBeta: false },
];

export const MOCK_FEATURE_FLAGS: FeatureFlagItem[] = [
  { id: "ff-01", key: "enable_ai_smart_search", name: "AI Natural Language Global Search", environment: "Production", isEnabled: true },
  { id: "ff-02", key: "enable_liquid_glass_ui", name: "iOS 26 Liquid Glass UI Theme", environment: "Beta", isEnabled: true },
  { id: "ff-03", key: "enable_offline_pwa_cache", name: "Offline Service Worker PWA Caching", environment: "Dev", isEnabled: false },
];

export const MOCK_AUTOMATION_RULES: AutomationRuleItem[] = [
  { id: "rule-01", name: "Auto-Send Attendance Defaulter SMS Alert", trigger: "Attendance < 75%", action: "Send SMS to Parent", isEnabled: true },
  { id: "rule-02", name: "Auto-Lock Exam Admit Card on Fee Due", trigger: "Fee Overdue > 15 Days", action: "Lock Admit Card Download", isEnabled: true },
];

export const MOCK_WEBHOOKS: WebhookEndpointItem[] = [
  { id: "wh-01", url: "https://api.nits.edu/webhooks/razorpay", direction: "Incoming", events: ["payment.captured", "payment.failed"], status: "Active" },
  { id: "wh-02", url: "https://canvas.nits.edu/api/v1/sync", direction: "Outgoing", events: ["grade.published", "course.created"], status: "Active" },
];
