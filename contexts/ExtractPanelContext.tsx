'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ExtractPanelContextType {
  isOpen: boolean;
  url: string;
  query: string;
  panelWidth: number;
  openPanel: (url: string, query: string) => void;
  closePanel: () => void;
  setPanelWidth: (width: number) => void;
}

const ExtractPanelContext = createContext<ExtractPanelContextType | undefined>(undefined);

export const useExtractPanel = () => {
  const context = useContext(ExtractPanelContext);
  if (!context) {
    throw new Error('useExtractPanel must be used within ExtractPanelProvider');
  }
  return context;
};

export const ExtractPanelProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');
  const [panelWidth, setPanelWidth] = useState(400);

  const openPanel = (newUrl: string, newQuery: string) => {
    setUrl(newUrl);
    setQuery(newQuery);
    setIsOpen(true);
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  return (
    <ExtractPanelContext.Provider
      value={{
        isOpen,
        url,
        query,
        panelWidth,
        openPanel,
        closePanel,
        setPanelWidth,
      }}
    >
      {children}
    </ExtractPanelContext.Provider>
  );
};
