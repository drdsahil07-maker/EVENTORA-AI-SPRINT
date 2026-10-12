import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  ShieldAlert,
  Users,
  Building,
  Music,
  Inbox,
  CalendarCheck2,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeType?: 'teal' | 'amber' | 'slate';
}

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onSwitchRole: (newRole: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  onTabChange,
  onSwitchRole,
}) => {
  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'organizer':
        return [
          { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'my-events', label: 'My Events', icon: <Calendar className="w-4 h-4" /> },
          { id: 'create-event', label: 'Create Event', icon: <PlusCircle className="w-4 h-4 text-[#0D9488]" /> },
          { id: 'discover-artists', label: 'Discover Artists', icon: <Users className="w-4 h-4" /> },
          { id: 'discover-venues', label: 'Discover Venues', icon: <Building className="w-4 h-4" /> },
          { id: 'date-rescue', label: 'Date Rescue', icon: <ShieldAlert className="w-4 h-4 text-[#0D9488]" />, badge: 'Rescue', badgeType: 'teal' },
          { id: 'my-bookings', label: 'My Bookings', icon: <Inbox className="w-4 h-4" /> },
        ];
      case 'artist':
        return [
          { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'invitations', label: 'New Enquiries', icon: <Inbox className="w-4 h-4" />, badge: '2 New', badgeType: 'amber' },
          { id: 'gigs', label: 'Upcoming Bookings', icon: <Music className="w-4 h-4" />, badge: '3' },
          { id: 'standby-beacon', label: 'My Availability', icon: <ShieldCheck className="w-4 h-4 text-[#0D9488]" /> },
        ];
      case 'venue':
        return [
          { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'inquiries', label: 'Booking Enquiries', icon: <Inbox className="w-4 h-4" />, badge: '2 New', badgeType: 'amber' },
          { id: 'calendar', label: 'Availability Calendar', icon: <CalendarCheck2 className="w-4 h-4" /> },
          { id: 'spaces', label: 'Manage Venue', icon: <Building className="w-4 h-4" /> },
        ];
    }
  };

  const navItems = getNavItems();

  const roleLabels: Record<UserRole, { title: string; subtitle: string; tag: string }> = {
    organizer: {
      title: 'Event Organizer',
      subtitle: 'Event Management',
      tag: 'Organizer',
    },
    artist: {
      title: 'Artist / Performer',
      subtitle: 'Talent & Gigs',
      tag: 'Artist',
    },
    venue: {
      title: 'Venue Owner',
      subtitle: 'Spaces & Stages',
      tag: 'Venue',
    },
  };

  const currentRoleInfo = roleLabels[role];

  return (
    <aside className="w-60 bg-white border-r border-[#E2E8F0] flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Role Profile Header in Sidebar */}
      <div className="p-4 border-b border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
            Active Workspace
          </span>
          <span className="text-[10px] font-semibold bg-[#CCFBF1] text-[#0F766E] px-2 py-0.5 rounded-full">
            {currentRoleInfo.tag}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0F2747] text-white font-bold text-xs flex items-center justify-center">
            {role === 'organizer' ? 'EO' : role === 'artist' ? 'AP' : 'VO'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-[#0F172A] truncate">
              {currentRoleInfo.title}
            </h4>
            <p className="text-[11px] text-[#64748B] truncate">
              {currentRoleInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Unobtrusive Role Switcher */}
        <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
          <span className="text-[11px] text-[#64748B]">Switch role:</span>
          <div className="inline-flex rounded-lg border border-[#E2E8F0] p-0.5 bg-[#F8FAFC]">
            <button
              onClick={() => onSwitchRole('organizer')}
              title="Switch to Event Organizer"
              className={`px-2 py-0.5 text-[10px] font-semibold rounded cursor-pointer transition-colors ${
                role === 'organizer'
                  ? 'bg-white text-[#0D9488] shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Org
            </button>
            <button
              onClick={() => onSwitchRole('artist')}
              title="Switch to Artist / Performer"
              className={`px-2 py-0.5 text-[10px] font-semibold rounded cursor-pointer transition-colors ${
                role === 'artist'
                  ? 'bg-white text-[#0D9488] shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Artist
            </button>
            <button
              onClick={() => onSwitchRole('venue')}
              title="Switch to Venue Owner"
              className={`px-2 py-0.5 text-[10px] font-semibold rounded cursor-pointer transition-colors ${
                role === 'venue'
                  ? 'bg-white text-[#0D9488] shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Venue
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                isActive
                  ? 'bg-[#0D9488] text-white shadow-2xs'
                  : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-white' : 'text-[#64748B]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeType === 'teal'
                      ? 'bg-[#CCFBF1] text-[#0F766E]'
                      : item.badgeType === 'amber'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Safety & Trust Note at bottom */}
      <div className="p-3 m-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-center">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#0F2747] mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488]" />
          <span>Date Rescue Network</span>
        </div>
        <p className="text-[10px] text-[#64748B]">
          Verified artists, venues, and guaranteed event backups.
        </p>
      </div>
    </aside>
  );
};
