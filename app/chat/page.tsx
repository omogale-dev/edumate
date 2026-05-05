'use client';

import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { InputBar } from '@/components/chat/InputBar';
import { EmptyState } from '@/components/chat/EmptyState';
import { NameModal } from '@/components/ui/NameModal';
import { OrbState } from '@/components/three/OrbClient';
import {
  deleteConversation,
  getConversations,
  getUser,
  newId,
  saveUser,
  upsertConversation,
} from '@/lib/storage';
import { Conversation, Message, Mode, User } from '@/lib/types';
import { askEduMate } from '@/lib/api';
import { useSpeechSynthesis } from '@/lib/speech';

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<Mode>('study');
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const cancelStreamRef = useRef(false);
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();

  // Hydrate from storage
  useEffect(() => {
    const u = getUser();
    setUser(u);
    setConversations(getConversations());

    // Auto-collapse sidebar on small screens
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, []);

  // Sync isSpeaking
  useEffect(() => {
    if (!isSpeaking) setSpeakingMessageId(null);
  }, [isSpeaking]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [activeConversation?.messages, thinking, streamingId]);

  // Determine orb state for input bar
  const orbState: OrbState = thinking
    ? 'thinking'
    : streamingId
      ? 'speaking'
      : 'idle';

  const handleNewChat = useCallback(() => {
    setActiveId(null);
    cancel();
  }, [cancel]);

  const handleSelect = useCallback(
    (id: string) => {
      setActiveId(id);
      cancel();
    },
    [cancel]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const next = deleteConversation(id);
      setConversations(next);
      if (activeId === id) setActiveId(null);
    },
    [activeId]
  );

  const handleNameComplete = useCallback((_name: string) => {
    setUser(getUser());
  }, []);

  const handleStop = useCallback(() => {
    cancelStreamRef.current = true;
    setStreamingId(null);
    setThinking(false);
  }, []);

  // Stream a string into the active assistant message with a typewriter effect
  const streamIntoMessage = useCallback(
    async (
      conv: Conversation,
      assistantMessageId: string,
      fullText: string
    ): Promise<void> => {
      cancelStreamRef.current = false;
      setStreamingId(assistantMessageId);

      // adaptive speed: faster for long answers
      const baseDelay = fullText.length > 800 ? 8 : fullText.length > 300 ? 14 : 20;
      let current = '';

      for (let i = 0; i < fullText.length; i++) {
        if (cancelStreamRef.current) {
          current = fullText; // jump to end
          break;
        }
        current += fullText[i];

        // batched updates for performance
        if (i % 2 === 0 || i === fullText.length - 1) {
          setConversations((prev) => {
            const idx = prev.findIndex((c) => c.id === conv.id);
            if (idx < 0) return prev;
            const target = prev[idx];
            const newMessages = target.messages.map((m) =>
              m.id === assistantMessageId ? { ...m, content: current } : m
            );
            const updated: Conversation = {
              ...target,
              messages: newMessages,
              updatedAt: Date.now(),
            };
            const copy = [...prev];
            copy[idx] = updated;
            return copy;
          });
          await new Promise((r) => setTimeout(r, baseDelay));
        }
      }

      // Final write to localStorage
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === conv.id);
        if (idx < 0) return prev;
        const finalMessages = prev[idx].messages.map((m) =>
          m.id === assistantMessageId ? { ...m, content: fullText } : m
        );
        const finalConv: Conversation = {
          ...prev[idx],
          messages: finalMessages,
          updatedAt: Date.now(),
        };
        const all = upsertConversation(finalConv);
        return all;
      });

      setStreamingId(null);
    },
    []
  );

  const handleSend = useCallback(
    async (text: string) => {
      if (!user) return;

      // Build/find conversation
      let conv: Conversation;
      if (activeConversation) {
        conv = activeConversation;
      } else {
        conv = {
          id: newId(),
          title: text.length > 48 ? text.slice(0, 48).trim() + '…' : text,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setActiveId(conv.id);
      }

      // Append user message
      const userMessage: Message = {
        id: newId(),
        role: 'user',
        content: text,
        createdAt: Date.now(),
      };
      const assistantMessage: Message = {
        id: newId(),
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
      };
      const withUser: Conversation = {
        ...conv,
        messages: [...conv.messages, userMessage, assistantMessage],
        updatedAt: Date.now(),
      };
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === conv.id);
        if (idx < 0) return [withUser, ...prev];
        const copy = [...prev];
        copy[idx] = withUser;
        return copy;
      });
      upsertConversation(withUser);

      setThinking(true);

      try {
        const response = await askEduMate({
          phone: user.phone,
          name: user.name,
          question: text,
        });

        setThinking(false);

        const answer = (response.answer ?? '').toString();
        if (answer) {
          await streamIntoMessage(withUser, assistantMessage.id, answer);
        } else {
          // No answer field — empty placeholder
          await streamIntoMessage(
            withUser,
            assistantMessage.id,
            "Hmm, I didn't get a response. Please try again."
          );
        }

        if (typeof response.xp === 'number') {
          const updatedUser: User = { ...user, xp: response.xp };
          saveUser(updatedUser);
          setUser(updatedUser);
        }
      } catch (err) {
        setThinking(false);
        const fallback =
          'Sorry, I had trouble reaching the tutor service. Please check your connection and try again.';
        await streamIntoMessage(withUser, assistantMessage.id, fallback);
        // log for dev visibility
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },
    [activeConversation, streamIntoMessage, user]
  );

  const handleSpeak = (m: Message) => {
    if (speakingMessageId === m.id) {
      cancel();
      setSpeakingMessageId(null);
      return;
    }
    setSpeakingMessageId(m.id);
    speak(m.content);
  };

  const handleStopSpeak = () => {
    cancel();
    setSpeakingMessageId(null);
  };

  return (
    <>
      <NameModal onComplete={handleNameComplete} />

      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          user={user}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          onNewChat={handleNewChat}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />

        <main className="flex-1 flex flex-col min-w-0 relative noise-overlay">
          <ChatHeader
            mode={mode}
            onModeChange={setMode}
            xp={user?.xp ?? 0}
          />

          {!activeConversation ? (
            <EmptyState
              userName={user?.name}
              orbState={orbState}
              onSuggestion={handleSend}
            />
          ) : (
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 sm:px-6 py-8"
            >
              <div className="max-w-3xl mx-auto space-y-6">
                <AnimatePresence initial={false}>
                  {activeConversation.messages.map((m) => (
                    <MessageBubble
                      key={m.id}
                      message={m}
                      userInitial={user?.name?.[0]?.toUpperCase()}
                      isStreaming={streamingId === m.id}
                      onSpeak={() => handleSpeak(m)}
                      onStopSpeak={handleStopSpeak}
                      isSpeaking={speakingMessageId === m.id && isSpeaking}
                    />
                  ))}
                  {thinking && <TypingIndicator key="typing" />}
                </AnimatePresence>
              </div>
            </div>
          )}

          <InputBar
            onSend={handleSend}
            disabled={!user}
            isStreaming={!!streamingId || thinking}
            showOrb={!!activeConversation}
            orbState={orbState}
            onStop={handleStop}
          />
        </main>
      </div>
    </>
  );
}
