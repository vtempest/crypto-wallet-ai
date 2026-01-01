'use client';

/* eslint-disable @next/next/no-img-element */
import React, { MutableRefObject } from 'react';
import { cn } from '@/lib/utils';
import {
  BookCopy,
  Disc3,
  Volume2,
  StopCircle,
  Layers3,
  Plus,
} from 'lucide-react';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';
import Copy from '../MessageActions/Copy';
import Rewrite from '../MessageActions/Rewrite';
import MessageSources from '../web-search/MessageSources';
import SearchImages from '../web-search/SearchImages';
import SearchVideos from '../web-search/SearchVideos';
import { useSpeech } from 'react-text-to-speech';
import ThinkBox from './ThinkBox';
import { useChat, Section } from '@/lib/hooks/useChat';
import Citation from '../web-search/Citation';

const ThinkTagProcessor = ({
  children,
  thinkingEnded,
}: {
  children: React.ReactNode;
  thinkingEnded: boolean;
}) => {
  return (
    <ThinkBox content={children as string} thinkingEnded={thinkingEnded} />
  );
};

const MessageBox = ({
  section,
  sectionIndex,
  dividerRef,
  isLast,
}: {
  section: Section;
  sectionIndex: number;
  dividerRef?: MutableRefObject<HTMLDivElement | null>;
  isLast: boolean;
}) => {
  const { loading, chatTurns, sendMessage, rewrite } = useChat();

  const parsedMessage = section.parsedAssistantMessage || '';
  const speechMessage = section.speechMessage || '';
  const thinkingEnded = section.thinkingEnded;

  const { speechStatus, start, stop } = useSpeech({ text: speechMessage });

  const markdownOverrides: MarkdownToJSX.Options = {
    overrides: {
      think: {
        component: ThinkTagProcessor,
        props: {
          thinkingEnded: thinkingEnded,
        },
      },
      citation: {
        component: Citation,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className={'w-full pt-8 break-words'}>
        <h2 className="text-foreground font-medium text-3xl lg:w-9/12">
          {section.userMessage.content}
        </h2>
      </div>

      <div className="flex flex-col space-y-6">
        <div
          ref={dividerRef}
          className="flex flex-col space-y-6 w-full"
        >
          {section.sourceMessage &&
            section.sourceMessage.sources.length > 0 && (
              <div className="flex flex-col space-y-2">
                {/* <div className="flex flex-row items-center space-x-2">
                  <BookCopy className="text-foreground" size={20} />
                  <h3 className="text-foreground font-medium text-xl">
                    Sources
                  </h3>
                </div> */}
                <MessageSources sources={section.sourceMessage.sources} />
              </div>
            )}

          {section.assistantMessage && (
            <div className="flex flex-col lg:flex-row gap-3 w-full">
              <div className="w-full lg:w-1/2">
                <SearchImages
                  query={section.userMessage.content}
                  chatHistory={chatTurns.slice(0, sectionIndex * 2)}
                  messageId={section.assistantMessage.messageId}
                />
              </div>
              <div className="w-full lg:w-1/2">
                <SearchVideos
                  chatHistory={chatTurns.slice(0, sectionIndex * 2)}
                  query={section.userMessage.content}
                  messageId={section.assistantMessage.messageId}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-2">
            {section.sourceMessage && (
              <div className="flex flex-row items-center space-x-2">
              </div>
            )}

            {section.assistantMessage && (
              <>
                <Markdown
                  className={cn(
                    'prose prose-h1:mb-3 prose-h2:mb-2 prose-h2:mt-6 prose-h2:font-[800] prose-h3:mt-4 prose-h3:mb-1.5 prose-h3:font-[600] dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 font-[400]',
                    'max-w-none break-words text-foreground',
                  )}
                  options={markdownOverrides}
                >
                  {parsedMessage}
                </Markdown>

                {loading && isLast ? null : (
                  <div className="flex flex-row items-center justify-between w-full text-foreground py-4 -mx-2">
                    <div className="flex flex-row items-center space-x-1">
                      <Rewrite
                        rewrite={rewrite}
                        messageId={section.assistantMessage.messageId}
                      />
                    </div>
                    <div className="flex flex-row items-center space-x-1">
                      <Copy
                        initialMessage={section.assistantMessage.content}
                        section={section}
                      />
                      <button
                        onClick={() => {
                          if (speechStatus === 'started') {
                            stop();
                          } else {
                            start();
                          }
                        }}
                        className="p-2 text-muted-foreground rounded-xl hover:bg-secondary transition duration-200 hover:text-foreground"
                      >
                        {speechStatus === 'started' ? (
                          <StopCircle size={18} />
                        ) : (
                          <Volume2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {isLast &&
                  section.suggestions &&
                  section.suggestions.length > 0 &&
                  section.assistantMessage &&
                  !loading && (
                    <div className="mt-8 pt-6 border-t border-border/50">
                      {/* <div className="flex flex-row items-center space-x-2 mb-4">
                        <Layers3
                          className="text-foreground"
                          size={20}
                        />
                        <h3 className="text-foreground font-medium text-xl">
                          Follow-up Questions
                        </h3>
                      </div> */}
                      <div className="space-y-0">
                        {section.suggestions.map(
                          (suggestion: string, i: number) => (
                            <div key={i}>
                              {i > 0 && (
                                <div className="h-px bg-border mx-3" />
                              )}
                              <button
                                onClick={() => sendMessage(suggestion)}
                                className="group w-full px-3 py-4 text-left transition-colors duration-200"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-200 leading-relaxed">
                                    {suggestion}
                                  </p>
                                  <Plus
                                    size={16}
                                    className="text-muted-foreground/60 group-hover:text-primary transition-colors duration-200 flex-shrink-0"
                                  />
                                </div>
                              </button>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
