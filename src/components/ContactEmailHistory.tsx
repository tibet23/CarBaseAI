import React, { useState, useEffect } from 'react';
import {
  Mail,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Inbox,
  Send,
  Sparkles,
  Link2,
  Unlink
} from 'lucide-react';
import { ContactCard, EmailThreadSummary, EmailMessage } from '../types';
import {
  getSavedGmailAuth,
  connectGmailAccount,
  clearGmailAuth,
  fetchEmailHistoryWithContact,
  formatEmailDate,
  StoredGmailAuth
} from '../utils/gmailService';

interface ContactEmailHistoryProps {
  card: ContactCard;
  privacyMode?: boolean;
}

export const ContactEmailHistory: React.FC<ContactEmailHistoryProps> = ({
  card,
  privacyMode = false,
}) => {
  const [auth, setAuth] = useState<StoredGmailAuth | null>(() => getSavedGmailAuth());
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [threads, setThreads] = useState<EmailThreadSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'threads' | 'timeline'>('threads');

  const contactEmail = card.email?.trim();

  const loadHistory = async (token: string) => {
    if (!contactEmail) return;
    setIsLoading(true);
    setError(null);
    try {
      const results = await fetchEmailHistoryWithContact(contactEmail, token);
      setThreads(results);
      if (results.length > 0) {
        setExpandedThreadId(results[0].threadId);
      }
    } catch (err: any) {
      console.error('Failed to load email history:', err);
      if (err?.message?.includes('expired') || err?.message?.includes('401')) {
        setAuth(null);
        setError('Google Session expired. Please reconnect your account.');
      } else {
        setError(err?.message || 'Could not fetch email conversations from Gmail.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentAuth = getSavedGmailAuth();
    setAuth(currentAuth);
    if (currentAuth?.accessToken && contactEmail) {
      loadHistory(currentAuth.accessToken);
    } else {
      setThreads([]);
    }
  }, [contactEmail]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const token = await connectGmailAccount();
      const newAuth = getSavedGmailAuth();
      setAuth(newAuth);
      if (token && contactEmail) {
        await loadHistory(token);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to authorize with Google.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    clearGmailAuth();
    setAuth(null);
    setThreads([]);
  };

  const maskEmail = (text: string) => {
    if (!text || !privacyMode) return text;
    return text.replace(/([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/g, (match, user, domain) => {
      return `${user.slice(0, 2)}***@${domain}`;
    });
  };

  if (!contactEmail) {
    return (
      <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2 bg-slate-50/50 dark:bg-slate-900/40">
        <Mail className="h-6 w-6 text-slate-400 mx-auto" />
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          No email address associated with this card
        </p>
        <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
          Add an email to {card.fullName}'s card details above to view communication and chat history.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-sm space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Email &amp; Chat History
              </h3>
              {auth && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                  Connected
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Conversations with <strong className="text-slate-700 dark:text-slate-200">{maskEmail(contactEmail)}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {auth ? (
            <>
              <button
                onClick={() => loadHistory(auth.accessToken)}
                disabled={isLoading}
                title="Refresh email history"
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleDisconnect}
                title="Disconnect Gmail Account"
                className="inline-flex items-center px-2 py-1 rounded-lg text-[11px] font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                <Unlink className="h-3 w-3 mr-1" />
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Link2 className="h-3.5 w-3.5 mr-1.5" />
              {isConnecting ? 'Connecting...' : 'Connect Gmail'}
            </button>
          )}
        </div>
      </div>

      {/* Unconnected Banner */}
      {!auth && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-red-50/70 to-slate-50 dark:from-red-950/20 dark:to-slate-900 border border-red-100 dark:border-red-900/40 text-center space-y-3">
          <div className="mx-auto w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-300">
            <Inbox className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Connect your Gmail to view timeline history
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Securely view relevant email threads, meeting notes, exchange dates, and replies with {card.fullName} right inside their card.
            </p>
          </div>
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20 transition-all cursor-pointer"
          >
            <Mail className="h-3.5 w-3.5 mr-1.5" />
            {isConnecting ? 'Opening Google Sign-In...' : 'Connect Google Workspace / Gmail'}
          </button>
          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>Read-only access • Tokens stored locally on your device</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      )}

      {/* Connected and Loading */}
      {auth && isLoading && (
        <div className="p-8 text-center space-y-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Searching email threads with {card.fullName}...
          </p>
        </div>
      )}

      {/* Connected and empty */}
      {auth && !isLoading && threads.length === 0 && !error && (
        <div className="p-6 text-center space-y-2 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          <Inbox className="h-6 w-6 text-slate-400 mx-auto" />
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            No previous email conversations found
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            We searched for emails exchanged with <strong>{maskEmail(contactEmail)}</strong>.
          </p>
          <a
            href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Following up / ${card.company || ''}`)}`}
            className="inline-flex items-center px-3 py-1.5 mt-2 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
          >
            <Send className="h-3 w-3 mr-1.5" />
            Send First Email to {card.fullName}
          </a>
        </div>
      )}

      {/* Connected with Threads */}
      {auth && !isLoading && threads.length > 0 && (
        <div className="space-y-3">
          {/* Sub-header tabs */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Found {threads.length} Email Thread{threads.length === 1 ? '' : 's'}
            </span>
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px]">
              <button
                onClick={() => setActiveView('threads')}
                className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeView === 'threads'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Threads ({threads.length})
              </button>
              <button
                onClick={() => setActiveView('timeline')}
                className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeView === 'timeline'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Timeline View
              </button>
            </div>
          </div>

          {/* List of Threads */}
          {activeView === 'threads' ? (
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {threads.map((thread) => {
                const isExpanded = expandedThreadId === thread.threadId;
                return (
                  <div
                    key={thread.threadId}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 overflow-hidden transition-all"
                  >
                    {/* Thread Header Row */}
                    <button
                      onClick={() => setExpandedThreadId(isExpanded ? null : thread.threadId)}
                      className="w-full p-3 text-left flex items-start justify-between hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start space-x-2.5 min-w-0 pr-2">
                        <MessageSquare className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {thread.subject}
                            </span>
                            {thread.messageCount > 1 && (
                              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                {thread.messageCount} msgs
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {thread.snippet}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                          {formatEmailDate(thread.lastMessageDate)}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Messages */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 p-3 space-y-2.5 text-xs">
                        {thread.messages.map((msg, index) => (
                          <div
                            key={msg.id || index}
                            className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 space-y-1.5 shadow-2xs"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                                {maskEmail(msg.from)}
                              </div>
                              <div className="text-[10px] text-slate-400 whitespace-nowrap flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatEmailDate(msg.date)}
                              </div>
                            </div>
                            <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {msg.snippet}
                            </div>
                          </div>
                        ))}

                        <div className="pt-1 flex items-center justify-end">
                          <a
                            href={`https://mail.google.com/mail/u/0/#inbox/${thread.threadId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Open complete thread in Gmail <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Timeline View */
            <div className="relative pl-6 space-y-4 max-h-80 overflow-y-auto pr-1">
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800" />
              {threads
                .flatMap((t) => t.messages)
                .sort((a, b) => parseInt(b.internalDate, 10) - parseInt(a.internalDate, 10))
                .map((msg) => (
                  <div key={msg.id} className="relative group">
                    <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 bg-blue-500 group-hover:scale-125 transition-transform" />
                    <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {msg.subject || '(No Subject)'}
                        </span>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">
                          {formatEmailDate(msg.date)}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        From: {maskEmail(msg.from)}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                        {msg.snippet}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
