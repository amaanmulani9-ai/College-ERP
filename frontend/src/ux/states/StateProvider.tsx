import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ToastAlert {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message?: string;
}

export interface StateSystemContextType {
  toasts: ToastAlert[];
  addToast: (toast: Omit<ToastAlert, "id">) => void;
  removeToast: (id: string) => void;
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

export const StateSystemContext = createContext<StateSystemContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastAlert[]>([]);
  const [isGlobalLoading, setGlobalLoading] = useState<boolean>(false);

  const addToast = (toast: Omit<ToastAlert, "id">) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <StateSystemContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        isGlobalLoading,
        setGlobalLoading,
      }}
    >
      {children}
    </StateSystemContext.Provider>
  );
};
