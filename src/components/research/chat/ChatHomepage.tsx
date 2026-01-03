'use client';

import { useState, useEffect } from 'react';
import EmptyChatMessageInput from './EmptyChatMessageInput';
import Footer, { defaultFooterLinks } from '@/components/layout/Footer';
import SettingsButtonMobile from '@/components/Settings/SettingsButtonMobile';
import MessageBoxLoading from './MessageBoxLoading';
import UserMenu from '@/components/layout/UserMenu';
import { WalletInfo } from '@/components/wallet/WalletInfo';

const EmptyChat = ({ background }: { background?: string }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showWalletInfo, setShowWalletInfo] = useState(false);

  // Check if user has a wallet connected
  useEffect(() => {
    fetch('/api/wallet/info')
      .then(res => res.ok ? setShowWalletInfo(true) : setShowWalletInfo(false))
      .catch(() => setShowWalletInfo(false));
  }, []);

  return (
    <div className="relative min-h-screen w-full">


      <div className="relative z-10">
        <div className="absolute w-full flex flex-row items-center justify-end gap-2 pr-5 pt-5">
          <UserMenu />
          <SettingsButtonMobile />
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen max-w-screen-sm mx-auto px-4">
          <div className="flex flex-col items-center justify-center w-full space-y-6">
            {/* <MessageBoxLoading /> */}
            <div className="relative w-full max-w-md group cursor-pointer" onClick={() => setIsVideoModalOpen(true)}>
              <img
                src="/aiwallet-logo.png"
                alt="Wallet Chat AI"
                className="w-full"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-6 group-hover:bg-black/70 transition-all group-hover:scale-110">
                  <svg
                    className="w-16 h-16 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Show wallet info if connected */}
            {showWalletInfo && (
              <div className="w-full max-w-md">
                <WalletInfo />
              </div>
            )}

            <EmptyChatMessageInput />
          </div>
        </div>
      </div>
      <Footer listFooterLinks={defaultFooterLinks} />

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video player */}
            <video
              className="w-full rounded-lg"
              controls
              autoPlay
              src="https://i.imgur.com/0F15G5c.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmptyChat;
