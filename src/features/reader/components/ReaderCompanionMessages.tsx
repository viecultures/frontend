import { Bot } from 'lucide-react';

export interface CompanionMessage { sender: 'user' | 'ai'; text: string }
interface ReaderCompanionMessagesProps { messages: CompanionMessage[] }

export function ReaderCompanionMessages({ messages }: ReaderCompanionMessagesProps) {
  return (
    <div className="reader-companion-messages" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions">
      {messages.map((message, index) => (
        <div key={index} className={`reader-companion-message reader-companion-message--${message.sender}`}>
          {message.sender === 'ai' && <Bot size={17} aria-hidden="true" />}
          <div><span className="sr-only">{message.sender === 'user' ? 'You: ' : 'Companion preview: '}</span>{message.text}</div>
        </div>
      ))}
    </div>
  );
}
