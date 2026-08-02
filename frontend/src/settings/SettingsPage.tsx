import React from "react";
import { SettingsProvider } from "./SettingsProvider";
import { SettingsLayout } from "./SettingsLayout";

export const SettingsPage: React.FC = () => {
  return (
    <SettingsProvider>
      <SettingsLayout />
    </SettingsProvider>
  );
};

export default SettingsPage;
