import React from 'react';
import { X, Check, Bell, AlertTriangle, ShieldCheck, Info, Sparkles } from 'lucide-react';
import { NotificationItem, UserRole } from '../../types';
import { Button } from './Button';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onNavigateToRole?: (role: UserRole) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onDismiss,
  onNavigateToRole,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'backup':
        return <ShieldCheck className="w-4 h-4 text-[#0D9488]" />;
      case 'confirmed':
        return <Check className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-sky-600" />;
    }
  };

  const getBorderColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'urgent':
        return 'border-l-4 border-l-rose-500';
      case 'backup':
        return 'border-l-4 border-l-[#0D9488]';
      case 'confirmed':
        return 'border-l-4 border-l-emerald-500';
      default:
        return 'border-l-4 border-l-sky-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white shadow-xl flex flex-col border-l border-[#E2E8F0]">
          {/* Header */}
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#0D9488]" />
              <h3 className="font-bold text-sm text-[#0F2747]">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-[#0D9488] text-white px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-200 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action toolbar */}
          <div className="px-4 py-2 border-b border-[#E2E8F0] flex items-center justify-between text-xs bg-white">
            <span className="text-[#64748B]">Real-time Network Feed</span>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[#0D9488] hover:text-[#0F766E] font-medium cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="text-center py-12 px-4 text-[#64748B]">
                <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium">All caught up!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  No active backup alerts or urgent notifications.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border border-[#E2E8F0] bg-white text-xs transition-all ${getBorderColor(
                    item.type
                  )} ${!item.read ? 'bg-sky-50/20' : 'opacity-90'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-semibold text-[#0F2747]">
                      {getIcon(item.type)}
                      <span>{item.title}</span>
                    </div>
                    <span className="text-[10px] text-[#94A3B8] whitespace-nowrap">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="mt-1 text-[#475569] text-[11px] leading-relaxed">
                    {item.message}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-[#F1F5F9] flex items-center justify-between">
                    {item.roleTarget && onNavigateToRole ? (
                      <button
                        onClick={() => {
                          onNavigateToRole(item.roleTarget!);
                          onClose();
                        }}
                        className="text-[10px] font-semibold text-[#0D9488] hover:text-[#0F766E] cursor-pointer"
                      >
                        View in {item.roleTarget} mode →
                      </button>
                    ) : (
                      <span className="text-[10px] text-[#94A3B8]">
                        Network Broadcast
                      </span>
                    )}

                    <button
                      onClick={() => onDismiss(item.id)}
                      className="text-[10px] text-[#94A3B8] hover:text-slate-600 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] text-center">
            <span className="text-[10px] text-[#64748B] flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-[#0D9488]" />
              Eventora Automated Standby Dispatch Engine
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
