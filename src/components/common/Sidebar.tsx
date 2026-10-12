import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  ShieldAlert,
  Users,
  Building,
  PlusCircle,
  Sparkles,
  CalendarCheck,
  MessageSquare,
  BarChart3,
  Crown,
  ArrowRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeType?: 'new' | 'count' | 'teal';
}

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onSwitchRole: (newRole: UserRole) => void;
  onNavigateToPricing?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  onTabChange,
  onSwitchRole,
  onNavigateToPricing,
}) => {
  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'organizer':
        return [
          { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'my-events', label: 'My Events', icon: <Calendar className="w-4 h-4" /> },
          { id: 'create-event', label: 'Create Event', icon: <PlusCircle className="w-4 h-4" /> },
          { id: 'discover-artists', label: 'Discover Artists', icon: <Users className="w-4 h-4" /> },
          { id: 'discover-venues', label: 'Discover Venues', icon: <Building className="w-4 h-4" /> },
          { id: 'date-rescue', label: 'Date Rescue', icon: <ShieldAlert className="w-4 h-4 text-[#0D9488]" />, badge: 'New', badgeType: 'new' },
          { id: 'my-bookings', label: 'My Bookings', icon: <CalendarCheck className="w-4 h-4" /> },
          { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" />, badge: '2', badgeType: 'count' },
          { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'pricing', label: 'Pricing & Plans', icon: <Crown className="w-4 h-4 text-amber-400" /> },
        ];
      case 'artist':
        return [
          { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'requests', label: 'Booking Requests', icon: <CalendarCheck className="w-4 h-4" /> },
          { id: 'availability', label: 'My Availability', icon: <Calendar className="w-4 h-4" /> },
          { id: 'profile', label: 'My Profile', icon: <Users className="w-4 h-4" /> },
          { id: 'rescue-opportunities', label: 'Date Rescue Opportunities', icon: <ShieldAlert className="w-4 h-4 text-[#0D9488]" />, badge: 'Active', badgeType: 'new' },
          { id: 'plans', label: 'Plans', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
        ];
      case 'venue':
        return [
          { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'inquiries', label: 'Booking Enquiries', icon: <CalendarCheck className="w-4 h-4" />, badge: '2 New', badgeType: 'count' },
          { id: 'calendar', label: 'Availability Calendar', icon: <Calendar className="w-4 h-4" /> },
          { id: 'spaces', label: 'Manage Venue', icon: <Building className="w-4 h-4" /> },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-gradient-to-b from-[#0A1128] via-[#0F1E36] to-[#0A1128] text-slate-300 border-r border-slate-800/80 flex flex-col shrink-0 min-h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          {/* Logo Mark */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 via-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
            <span className="font-extrabold text-white text-lg tracking-tight">E</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base text-white tracking-wider">EVENTORA</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate tracking-tight">
              Every Event. Every Talent. One Network.
            </p>
          </div>
        </div>

        {/* Role Switcher Toolbar */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Workspace:</span>
          <div className="inline-flex rounded-lg border border-slate-700/60 p-0.5 bg-slate-900/80">
            <button
              onClick={() => onSwitchRole('organizer')}
              title="Event Organizer"
              className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-all ${
                role === 'organizer'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Org
            </button>
            <button
              onClick={() => onSwitchRole('artist')}
              title="Artist / Performer"
              className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-all ${
                role === 'artist'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Artist
            </button>
            <button
              onClick={() => onSwitchRole('venue')}
              title="Venue Owner"
              className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer transition-all ${
                role === 'venue'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Venue
            </button>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left relative group ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500/25 via-teal-500/15 to-purple-600/25 text-white border border-teal-400/50 shadow-[0_0_18px_rgba(13,148,136,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-teal-300' : 'text-slate-400 group-hover:text-slate-200'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeType === 'new'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xs shadow-blue-500/30'
                      : item.badgeType === 'count'
                      ? 'bg-rose-500 text-white text-[10px] min-w-4 h-4 flex items-center justify-center rounded-full'
                      : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Upgrade to Pro Card */}
      <div className="p-3 mx-3 mb-2 rounded-2xl bg-gradient-to-br from-slate-900/90 via-purple-950/40 to-slate-900/90 border border-purple-500/30 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-start gap-2.5 mb-2 relative">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <Crown className="w-4 h-4 fill-slate-950" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white">Upgrade to Pro</h4>
            <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
              Get unlimited backups & premium support
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (onNavigateToPricing) {
              onNavigateToPricing();
            } else {
              onTabChange('pricing');
            }
          }}
          className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white text-[11px] font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 cursor-pointer transition-all active:scale-[0.98]"
        >
          <span>View Plans</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Branding / Version Pill */}
      <div className="px-5 py-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-teal-400 to-purple-600 flex items-center justify-center text-white font-black text-[9px]">
            E
          </div>
          <span className="font-semibold text-slate-400 text-xs">EVENTORA</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">v1.0.0</span>
      </div>
    </aside>
  );
};
