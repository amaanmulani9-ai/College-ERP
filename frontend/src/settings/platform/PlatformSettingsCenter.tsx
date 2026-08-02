import React, { useState } from "react";
import { BrandingPage } from "./BrandingPage";
import { ThemeManagementPage } from "./ThemeManagementPage";
import { EmailTemplatesPage } from "./EmailTemplatesPage";
import { NotificationSettingsPage } from "./NotificationSettingsPage";
import { SMSSettingsPage } from "./SMSSettingsPage";
import { PaymentGatewayPage } from "./PaymentGatewayPage";
import { CommunicationSettingsPage } from "./CommunicationSettingsPage";
import { AIConfigurationPage } from "./AIConfigurationPage";
import { IntegrationCenterPage } from "./IntegrationCenterPage";
import { ModuleConfigurationPage } from "./ModuleConfigurationPage";
import { FeatureFlagsPage } from "./FeatureFlagsPage";
import { AutomationRulesPage } from "./AutomationRulesPage";
import { WebhookManagementPage } from "./WebhookManagementPage";

type PlatformTab =
  | "branding"
  | "theme"
  | "email-templates"
  | "notifications"
  | "sms"
  | "payment"
  | "communication"
  | "ai"
  | "integrations"
  | "modules"
  | "feature-flags"
  | "automation"
  | "webhooks";

const TABS: { id: PlatformTab; label: string }[] = [
  { id: "branding", label: "Branding & CSS" },
  { id: "theme", label: "Theme Mode" },
  { id: "email-templates", label: "Email Templates" },
  { id: "notifications", label: "Notifications" },
  { id: "sms", label: "SMS Gateway" },
  { id: "payment", label: "Payment Gateways" },
  { id: "communication", label: "SMTP / Email" },
  { id: "ai", label: "AI Copilot" },
  { id: "integrations", label: "Integrations" },
  { id: "modules", label: "Module Toggles" },
  { id: "feature-flags", label: "Feature Flags" },
  { id: "automation", label: "Automation Rules" },
  { id: "webhooks", label: "Webhooks" },
];

export const PlatformSettingsCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PlatformTab>("branding");

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl font-semibold overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === t.id
                ? "bg-indigo-600 text-white font-bold shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Dynamic Sub-Page View */}
      {activeTab === "branding" && <BrandingPage />}
      {activeTab === "theme" && <ThemeManagementPage />}
      {activeTab === "email-templates" && <EmailTemplatesPage />}
      {activeTab === "notifications" && <NotificationSettingsPage />}
      {activeTab === "sms" && <SMSSettingsPage />}
      {activeTab === "payment" && <PaymentGatewayPage />}
      {activeTab === "communication" && <CommunicationSettingsPage />}
      {activeTab === "ai" && <AIConfigurationPage />}
      {activeTab === "integrations" && <IntegrationCenterPage />}
      {activeTab === "modules" && <ModuleConfigurationPage />}
      {activeTab === "feature-flags" && <FeatureFlagsPage />}
      {activeTab === "automation" && <AutomationRulesPage />}
      {activeTab === "webhooks" && <WebhookManagementPage />}
    </div>
  );
};

export default PlatformSettingsCenter;
