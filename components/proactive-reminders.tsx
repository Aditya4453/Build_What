"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Clock,
  X,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Calendar,
  Sparkles,
} from "lucide-react";
import demoStore from "@/data/demo-store.json";

export interface ReminderItem {
  id: string;
  documentType: string;
  vehicleOrDocLabel: string;
  daysUntilExpiry: number;
  reminderEnabled: boolean;
}

export function ProactiveReminders() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [toastMessages, setToastMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);

    // Load reminder records from demo store
    const rawList = (demoStore.proactiveReminders || []) as ReminderItem[];
    const valid = rawList
      .filter((item) => item.daysUntilExpiry <= 30 && item.daysUntilExpiry > 0)
      .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

    setReminders(valid);

    // Check if there is an urgent reminder (<= 7 days)
    const hasUrgent = valid.some((item) => item.daysUntilExpiry <= 7);

    // Automatically open as pop-up below header if urgent; otherwise keep collapsed
    const timer = setTimeout(() => {
      if (hasUrgent) {
        setIsOpen(true);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  // Active non-dismissed reminders
  const activeReminders = reminders.filter((item) => !dismissedIds.has(item.id));
  const urgentCount = activeReminders.filter((item) => item.daysUntilExpiry <= 7).length;
  const totalCount = activeReminders.length;

  if (totalCount === 0) return null;

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleToggle = (id: string, currentStatus: boolean, daysUntilExpiry: number) => {
    const nextStatus = !currentStatus;

    setReminders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, reminderEnabled: nextStatus } : item))
    );

    if (nextStatus) {
      const targetDays = Math.max(1, daysUntilExpiry - 14);
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + targetDays);
      const dateStr = targetDate.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });

      setToastMessages((prev) => ({
        ...prev,
        [id]: `✓ Reminder set for ${dateStr}`,
      }));
    } else {
      setToastMessages((prev) => ({
        ...prev,
        [id]: "Reminder disabled",
      }));
    }

    setTimeout(() => {
      setToastMessages((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 3500);
  };

  return (
    <aside
      aria-label="Proactive Citizen Alerts"
      className="fixed top-[125px] sm:top-[132px] right-3 sm:right-8 z-40 flex flex-col items-end gap-2 max-w-[360px] w-[calc(100vw-24px)] pointer-events-none animate-in fade-in duration-200"
    >
      {/* UX4G Header-Anchored Pop-up Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-full border shadow-md backdrop-blur-md transition-all duration-200 text-xs font-bold ${
          urgentCount > 0
            ? "border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-950/60 text-red-900 dark:text-red-200 ring-2 ring-red-400/40"
            : "border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 bg-[var(--ux4g-bg-neutral-elevated,#FFFFFF)] dark:bg-neutral-900 text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white hover:border-[#002B7F]"
        }`}
        aria-expanded={isOpen}
        aria-label="Toggle proactive document expiry reminders"
      >
        <div className="relative flex items-center">
          <Bell
            size={15}
            className={urgentCount > 0 ? "text-red-600 dark:text-red-400 animate-bounce" : "text-[#002B7F] dark:text-blue-400"}
          />
          {urgentCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
            </span>
          )}
        </div>

        <span className="font-extrabold tracking-tight">
          {urgentCount > 0 ? `${urgentCount} Urgent Expiry` : `Reminders (${totalCount})`}
        </span>

        {/* Chevron Arrow */}
        <div className="p-0.5 rounded-full bg-neutral-200/70 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
          {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </div>
      </button>

      {/* UX4G Pop-up Container */}
      {isOpen && (
        <div
          role="region"
          aria-label="Upcoming Document Expiries"
          className="pointer-events-auto w-full rounded-2xl border border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 bg-[var(--ux4g-bg-neutral-elevated,#FFFFFF)] dark:bg-neutral-900 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 space-y-3"
        >
          {/* Pop-up Title Bar */}
          <div className="flex items-center justify-between pb-2.5 border-b border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <span className={`ux4g-tag-s text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                urgentCount > 0 ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200 border border-red-200 dark:border-red-800" : "ux4g-tag-tonal-brand"
              }`}>
                {urgentCount > 0 ? "Urgent Action Required" : "Proactive Alerts"}
              </span>
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
                {totalCount} Upcoming
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close reminders pop-up"
            >
              <X size={15} />
            </button>
          </div>

          {/* Cards Stack */}
          <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-0.5">
            {activeReminders.map((item) => {
              const isUrgent = item.daysUntilExpiry <= 7;
              const toast = toastMessages[item.id];

              return (
                <article
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all duration-150 space-y-2.5 ${
                    isUrgent
                      ? "border-red-300 dark:border-red-800 bg-red-50/90 dark:bg-red-950/40 text-red-950 dark:text-red-100 shadow-sm ring-1 ring-red-300/40"
                      : "border-[var(--ux4g-border-neutral-subtle,#E5E5E5)] dark:border-neutral-800 bg-[var(--ux4g-bg-neutral-soft,#F5F5F5)] dark:bg-neutral-800/60 text-[var(--ux4g-text-neutral-primary,#171717)] dark:text-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`p-1.5 rounded-lg text-xs shrink-0 mt-0.5 ${
                          isUrgent
                            ? "bg-red-600 text-white shadow-sm"
                            : "bg-[#002B7F] text-white"
                        }`}
                      >
                        <AlertCircle size={13} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-tight">
                          {item.documentType}
                        </h4>
                        <p className={`text-[11px] font-medium mt-0.5 ${
                          isUrgent
                            ? "text-red-800 dark:text-red-300"
                            : "text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-400"
                        }`}>
                          {item.vehicleOrDocLabel}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                          isUrgent
                            ? "bg-red-600 text-white dark:bg-red-600 dark:text-white shadow-xs"
                            : "bg-[#EEF4FF] text-[#002B7F] dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        <Clock size={10} />
                        <span>
                          {item.daysUntilExpiry === 1 ? "1 day left" : `${item.daysUntilExpiry} days left`}
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDismiss(item.id)}
                        className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-700 transition-colors"
                        aria-label={`Dismiss ${item.documentType} reminder`}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div className={`pt-2 border-t flex items-center justify-between ${
                    isUrgent
                      ? "border-red-200 dark:border-red-900/60"
                      : "border-[var(--ux4g-border-neutral-subtle,#E5E5E5)]/70 dark:border-neutral-700/60"
                  }`}>
                    <label
                      htmlFor={`toggle-reminder-${item.id}`}
                      className={`flex items-center gap-2 cursor-pointer select-none text-[11px] font-semibold ${
                        isUrgent
                          ? "text-red-900 dark:text-red-200"
                          : "text-[var(--ux4g-text-neutral-secondary,#404040)] dark:text-neutral-300"
                      }`}
                    >
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input
                          id={`toggle-reminder-${item.id}`}
                          type="checkbox"
                          checked={item.reminderEnabled}
                          onChange={() => handleToggle(item.id, item.reminderEnabled, item.daysUntilExpiry)}
                          className="sr-only peer"
                        />
                        <div className={`w-7 h-4 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all ${
                          isUrgent ? "peer-checked:bg-red-600" : "peer-checked:bg-[#002B7F]"
                        }`} />
                      </div>
                      <span>Remind me 2 weeks before</span>
                    </label>
                  </div>

                  {/* Inline Toast */}
                  {toast && (
                    <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 animate-in fade-in duration-150 flex items-center gap-1">
                      <CheckCircle2 size={11} />
                      <span>{toast}</span>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="pt-1 text-center">
            <p className="text-[10px] text-[var(--ux4g-text-neutral-tertiary,#737373)] dark:text-neutral-500">
              National Vahan & Sarathi Document Registry
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
