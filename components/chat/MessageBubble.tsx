'use client';

import { motion } from 'framer-motion';
import { Volume2, VolumeX, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Message } from '@/lib/types';
import OrbClient from '@/components/three/OrbClient';

interface MessageBubbleProps {
  message: Message;
  userInitial?: string;
  isStreaming?: boolean;
  onSpeak?: () => void;
  onStopSpeak?: () => void;
  isSpeaking?: boolean;
}

export function MessageBubble({
  message,
  userInitial = 'S',
  isStreaming = false,
  onSpeak,
  onStopSpeak,
  isSpeaking = false,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-white/10 border border-border-strong flex items-center justify-center text-xs font-semibold text-white">
            {userInitial}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full overflow-hidden bg-black flex items-center justify-center">
            <OrbClient state={isStreaming ? 'speaking' : 'idle'} size="small" />
          </div>
        )}
      </div>

      {/* Message body */}
      <div
        className={`flex flex-col gap-1.5 max-w-[85%] sm:max-w-[75%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`relative px-4 py-3 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap break-words ${
            isUser
              ? 'bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 text-white rounded-tr-sm'
              : 'bg-elevated border border-border text-white/90 rounded-tl-sm'
          }`}
        >
          <span className={isStreaming ? 'typing-cursor' : ''}>
            {message.content || (isStreaming ? '' : '\u200B')}
          </span>
        </div>

        {/* Action row */}
        {!isUser && message.content && !isStreaming && (
          <div className="flex items-center gap-1 px-1">
            <button
              onClick={isSpeaking ? onStopSpeak : onSpeak}
              className="w-7 h-7 rounded-md flex items-center justify-center text-muted-strong hover:text-accent hover:bg-white/5 transition-colors"
              aria-label={isSpeaking ? 'Stop speaking' : 'Read aloud'}
            >
              {isSpeaking ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={handleCopy}
              className="w-7 h-7 rounded-md flex items-center justify-center text-muted-strong hover:text-accent hover:bg-white/5 transition-colors"
              aria-label="Copy message"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-accent" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
