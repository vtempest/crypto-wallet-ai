import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useChat } from '@/lib/hooks/useChat';

const quickActions = [
  { label: 'Check Balance', prompt: 'Show me my wallet balance' },
  { label: 'Wallet Summary', prompt: 'Show me my complete wallet summary' },
  { label: 'Gas Prices', prompt: 'What are the current gas prices?' },
  { label: 'Transaction Count', prompt: 'How many transactions has my wallet sent?' },
  { label: 'Chain Info', prompt: 'What network am I connected to?' },
];

const EmptyChatMessageInput = () => {
  const { sendMessage } = useChat();

  const [message, setMessage] = useState('');

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;

      const isInputFocused =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.hasAttribute('contenteditable');

      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    inputRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="w-full space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(message);
          setMessage('');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(message);
            setMessage('');
          }
        }}
        className="w-full"
      >
        <div className="flex flex-col bg-secondary px-3 pt-5 pb-3 rounded-2xl w-full border border-border shadow-sm transition-all duration-200 focus-within:border-input">
          <TextareaAutosize
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            minRows={2}
            className="px-2 bg-transparent placeholder:text-[15px] placeholder:text-muted-foreground text-sm text-foreground resize-none focus:outline-none w-full max-h-24 lg:max-h-36 xl:max-h-48"
            placeholder="What crypto transaction do you want to do?"
          />
          <div className="flex flex-row items-center justify-end mt-4">
            <button
              disabled={message.trim().length === 0}
              className="bg-primary text-primary-foreground disabled:text-muted-foreground disabled:bg-muted hover:bg-primary/85 transition duration-100 rounded-full p-2"
            >
              <ArrowRight className="bg-background" size={17} />
            </button>
          </div>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 justify-center">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => handleQuickAction(action.prompt)}
            className="px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-full text-sm font-medium text-foreground transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyChatMessageInput;
