export interface BrandingConfig {
  logoUrl: string;
  darkLogoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  footerText: string;
  customCSS: string;
}

export interface EmailTemplateItem {
  id: string;
  category: string;
  subject: string;
  triggerEvent: string;
  lastUpdated: string;
}

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  mode: "Sandbox" | "Production";
  isEnabled: boolean;
  apiKey: string;
  webhookStatus: "Healthy" | "Degraded" | "Disabled";
}

export interface AIPlatformConfig {
  provider: "Anthropic Claude" | "OpenAI GPT-4" | "Custom Azure LLM";
  model: string;
  temperature: number;
  monthlyTokenQuota: number;
  tokensConsumed: number;
  safetyFilter: "Strict" | "Moderate" | "Off";
}

export interface IntegrationAppItem {
  id: string;
  name: string;
  category: "Identity" | "LMS" | "Cloud Storage" | "Communication" | "Maps";
  status: "Connected" | "Disconnected" | "Config Needed";
  iconName: string;
}

export interface ERPModuleFlag {
  id: string;
  code: string;
  name: string;
  category: string;
  isEnabled: boolean;
  isBeta: boolean;
}

export interface FeatureFlagItem {
  id: string;
  key: string;
  name: string;
  environment: "Production" | "Beta" | "Dev";
  isEnabled: boolean;
}

export interface AutomationRuleItem {
  id: string;
  name: string;
  trigger: string;
  action: string;
  isEnabled: boolean;
}

export interface WebhookEndpointItem {
  id: string;
  url: string;
  direction: "Incoming" | "Outgoing";
  events: string[];
  status: "Active" | "Failing";
}
