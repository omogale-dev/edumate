'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Trash2, ChevronLeft, User as UserIcon, Menu } from 'lucide-react';
import { Conversation, User } from '@/lib/types';
import { Logo } from '@/components/ui/Logo';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  user: User | null;
  collapsed: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function Sidebar({
  conversations,
  activeId,
  user,
  collapsed,
  onToggle,
  onNewChat,
  onSelect,
  onDelete,
}: SidebarProps) {
  return (
    <>
      {/* Floating toggle when collapsed */}
      <AnimatePresence>
        {collapsed && (
          <motion.button
            onClick={onToggle}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="fixed top-4 left-4 z-30 w-9 h-9 rounded-lg bg-elevated border border-border-strong flex items-center justify-center hover:border-accent/40 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-4 h-4 text-muted" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative h-full bg-surface border-r border-border flex-shrink-0 overflow-hidden noise-overlay"
          >
            <div className="relative z-10 w-[280px] h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Logo size="sm" />
                <button
                  onClick={onToggle}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-muted hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {/* New chat */}
              <div className="p-3">
                <button
                  onClick={onNewChat}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border-strong bg-white/[0.02] hover:bg-white/5 hover:border-accent/30 transition-all group"
                >
                  <Plus className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">New Chat</span>
                </button>
              </div>

              {/* History */}
              <div className="flex-1 overflow-y-auto px-3 pb-3">
                {conversations.length === 0 ? (
                  <p className="px-2 py-6 text-center text-xs text-muted-strong font-mono">
                    No conversations yet
                  </p>
                ) : (
                  <div className="space-y-0.5">
                    <p className="px-2 py-2 text-[10px] font-mono uppercase tracking-widest text-muted-strong">
                      Recent
                    </p>
                    {conversations.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => onSelect(c.id)}
                        className={`group w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-sm transition-all ${
                          activeId === c.id
                            ? 'bg-white/5 text-white'
                            : 'text-muted hover:bg-white/[0.03] hover:text-white'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                        <span className="flex-1 truncate text-xs">{c.title}</span>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(c.id);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                              onDelete(c.id);
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded flex items-center justify-center text-muted-strong hover:text-red-400 hover:bg-red-400/10 transition-all"
                          aria-label="Delete conversation"
                        >
                          <Trash2 className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User profile */}
              <div className="p-3 border-t border-border">
                <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center text-black text-xs font-semibold flex-shrink-0">
                    {user?.name?.[0]?.toUpperCase() ?? <UserIcon className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.name ?? 'Student'}
                    </p>
                    <p className="text-[11px] font-mono text-muted-strong truncate">
                      ID · {user?.phone?.slice(-6) ?? '------'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
