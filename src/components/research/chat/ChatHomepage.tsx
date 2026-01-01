'use client';

import EmptyChatMessageInput from './EmptyChatMessageInput';
import Footer, { defaultFooterLinks } from '@/components/layout/Footer';
import SettingsButtonMobile from '@/components/Settings/SettingsButtonMobile';
import MessageBoxLoading from './MessageBoxLoading';

const EmptyChat = ({ background }: { background?: string }) => {
  return (
    <div className="relative min-h-screen w-full">
      {background && (
        <div className="fixed inset-0 z-0">
          <img
            src={background}
            alt="Background"
            className="w-full h-full object-cover"
          />
          {/* Overlay for better text readability */}
          {/* <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm" /> */}
        </div>
      )}

      <div className="relative z-10">
        <div className="absolute w-full flex flex-row items-center justify-end pr-5 pt-5">
          <SettingsButtonMobile />
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen max-w-screen-sm mx-auto p-2 space-y-4">
          <div className="flex flex-col items-center justify-center w-full space-y-8">
            <MessageBoxLoading />
            <img
              src="https://i.imgur.com/TFbQYoT.png"
              alt="Wallet Chat AI"
              className="w-full max-w-md"
            />
            <EmptyChatMessageInput />
          </div>
        </div>
      </div>
      <Footer listFooterLinks={defaultFooterLinks} />
    </div>
  );
};

export default EmptyChat;
