'use client';

import { useExtractPanel } from '@/contexts/ExtractPanelContext';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ArticleExtractPanelProps {
  onClose?: () => void;
}

const ArticleExtractPanel = ({ onClose }: ArticleExtractPanelProps) => {
  const { isOpen, url, closePanel } = useExtractPanel();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closePanel();
    }
  };

  if (!isOpen || !isDesktop) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-[400px] bg-light-secondary dark:bg-dark-secondary border-l border-light-200 dark:border-dark-200 z-40 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-light-200 dark:border-dark-200">
        <h3 className="text-sm font-medium dark:text-white">Article Extract</h3>
        <button
          onClick={handleClose}
          className="p-1 rounded-lg hover:bg-light-200 dark:hover:bg-dark-200 transition-colors"
        >
          <X size={18} className="text-black/70 dark:text-white/70" />
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <iframe
          src={url}
          className="w-full h-full border-0"
          title="Article Extract"
        />
      </div>
    </div>
  );
};

export default ArticleExtractPanel;
