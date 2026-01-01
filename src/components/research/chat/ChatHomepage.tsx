'use client';

import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import EmptyChatMessageInput from './EmptyChatMessageInput';
import { File } from './ChatWindow';
import Link from 'next/link';
import WeatherWidget from '../web-search/WeatherWidget';
import NewsArticleWidget from '../web-search/NewsArticleWidget';
import Footer, { defaultFooterLinks } from '@/components/layout/Footer';
import SettingsButtonMobile from '@/components/Settings/SettingsButtonMobile';
import {
  getShowNewsWidget,
  getShowWeatherWidget,
} from '@/lib/config/clientRegistry';
import MessageBoxLoading from './MessageBoxLoading';

const EmptyChat = ({ background }: { background?: string }) => {
  const [showWeather, setShowWeather] = useState(() =>
    typeof window !== 'undefined' ? getShowWeatherWidget() : true,
  );
  const [showNews, setShowNews] = useState(() =>
    typeof window !== 'undefined' ? getShowNewsWidget() : true,
  );

  useEffect(() => {
    const updateWidgetVisibility = () => {
      setShowWeather(getShowWeatherWidget());
      setShowNews(getShowNewsWidget());
    };

    updateWidgetVisibility();

    window.addEventListener('client-config-changed', updateWidgetVisibility);
    window.addEventListener('storage', updateWidgetVisibility);

    return () => {
      window.removeEventListener(
        'client-config-changed',
        updateWidgetVisibility,
      );
      window.removeEventListener('storage', updateWidgetVisibility);
    };
  }, []);

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
            {/* <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-w-sm -mt-8"
            >
              <source src="/icons/qwksearch-video.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video> */}
            <EmptyChatMessageInput />
          </div>
          {/* {(showWeather || showNews) && (
            <div className="flex flex-col w-full gap-4 mt-2 sm:flex-row sm:justify-center">
              {showWeather && (
                <div className="flex-1 w-full">
                  <WeatherWidget />
                </div>
              )}
              {showNews && (
                <div className="flex-1 w-full">
                  <NewsArticleWidget />
                </div>
              )}
            </div>
          )} */}
        </div>
      </div>
      <Footer listFooterLinks={defaultFooterLinks} />
    </div>
  );
};

export default EmptyChat;
