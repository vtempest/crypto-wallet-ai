'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import MessageInput from './MessageInput';
import MessageBox from './MessageBox';
import MessageBoxLoading from './MessageBoxLoading';
import { useChat } from '@/lib/hooks/useChat';
import { useExtractPanel } from '@/contexts/ExtractPanelContext';

const Chat = () => {
  const { sections, chatTurns, loading, messageAppeared } = useChat();
  const { isOpen: isPanelOpen, panelWidth } = useExtractPanel();

  const [dividerWidth, setDividerWidth] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const messageEnd = useRef<HTMLDivElement | null>(null);

  // Track window width for desktop/mobile layout (1024px matches Tailwind lg: breakpoint)
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    const updateDividerWidth = () => {
      if (dividerRef.current) {
        setDividerWidth(dividerRef.current.offsetWidth);
      }
    };

    updateDividerWidth();

    window.addEventListener('resize', updateDividerWidth);

    return () => {
      window.removeEventListener('resize', updateDividerWidth);
    };
  }, [isPanelOpen, panelWidth]);

  useEffect(() => {
    const scroll = () => {
      messageEnd.current?.scrollIntoView({ behavior: 'auto' });
    };

    if (chatTurns.length === 1) {
      document.title = `${chatTurns[0].content.substring(0, 30)} - QwkSearch`;
    }

    const messageEndBottom =
      messageEnd.current?.getBoundingClientRect().bottom ?? 0;

    const distanceFromMessageEnd = window.innerHeight - messageEndBottom;

    if (distanceFromMessageEnd >= -100) {
      scroll();
    }

    if (chatTurns[chatTurns.length - 1]?.role === 'user') {
      scroll();
    }
  }, [chatTurns]);

  // Calculate container max width based on panel state
  const containerStyle = isDesktop && isPanelOpen
    ? { marginRight: `${panelWidth}px` }
    : {};

  // Calculate input box positioning to account for extract panel
  const inputBoxStyle = isDesktop && isPanelOpen
    ? {
        width: `calc(100vw - ${panelWidth}px - 8rem)`,
      }
    : { width: dividerWidth };

  return (
    <div
      className="flex flex-col space-y-6 pt-8 pb-44 lg:pb-32 sm:mx-4 md:mx-8 transition-all duration-300"
      style={containerStyle}
    >
      {sections.map((section, i) => {
        const isLast = i === sections.length - 1;

        return (
          <Fragment key={section.userMessage.messageId}>
            <MessageBox
              section={section}
              sectionIndex={i}
              dividerRef={isLast ? dividerRef : undefined}
              isLast={isLast}
            />
            {!isLast && (
              <div className="h-px w-full bg-light-secondary dark:bg-dark-secondary" />
            )}
          </Fragment>
        );
      })}
      {loading && !messageAppeared && (
        <div className="flex items-center justify-center">
          <MessageBoxLoading />
        </div>
      )}
      <div ref={messageEnd} className="h-0" />
      {dividerWidth > 0 && (
        <div
          className="bottom-24 lg:bottom-10 fixed z-40 transition-all duration-300 sm:mx-4 md:mx-8"
          style={inputBoxStyle}
        >
          <MessageInput />
        </div>
      )}
    </div>
  );
};

export default Chat;
