import React, { useState } from 'react';
import {
  Bell,
  Search,
  Menu,
  X,
  ShieldCheck,
  Compass,
  Radio,
  SlidersHorizontal,
  PlusCircle,
  Building2,
  Mic2,
  CalendarDays,
  User,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { CurrentView, UserRole } from '../../types';
import { Button } from './Button';

interface HeaderProps {
  currentView: CurrentView;
  onNavigate: (view: CurrentView) => void;
  unreadCount: number;
  onToggleNotifications: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onOpenQuickAction: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  unreadCount,
  onToggleNotifications,
  mobileMenuOpen,
  onToggleMobileMenu,
  onOpenQuickAction,
  searchQuery,
  onSearchChange,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0F2747] flex items-center justify-center text-white font-black text-lg tracking-wider shadow-xs group-hover:bg-[#0D9488] transition-colors">
                <span className="text-[#CCFBF1]">E</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-[#0F2747]">
                    EVENTORA
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    Demo Workspace
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#64748B] tracking-tight hidden md:inline">
                  Every Event. Every Talent. One Network.
                </span>
              </div>
            </button>
          </div>

          {/* Role Navigation Quick Bar (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === 'landing'
                  ? 'bg-white text-[#0F2747] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Overview
            </button>
            <button
              onClick={() => onNavigate('organizer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === 'organizer'
                  ? 'bg-[#0D9488] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Organizer
            </button>
            <button
              onClick={() => onNavigate('artist')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === 'artist'
                  ? 'bg-[#0D9488] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Mic2 className="w-3.5 h-3.5" />
              Artist / Performer
            </button>
            <button
              onClick={() => onNavigate('venue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === 'venue'
                  ? 'bg-[#0D9488] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Venue Owner
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === 'pricing'
                  ? 'bg-[#0D9488] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Pricing
            </button>
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input (condensed on smaller screens) */}
            <div className="relative hidden md:block w-48 lg:w-56">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search events, talent..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-3 py-2 text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#0D9488] focus:bg-white transition-all"
              />
            </div>

            {/* Quick Action Trigger Button */}
            <Button
              variant="mint"
              size="sm"
              onClick={onOpenQuickAction}
              icon={<ShieldCheck className="w-3.5 h-3.5 text-[#0F766E]" />}
              className="hidden sm:inline-flex text-xs font-semibold"
            >
              Date Rescue
            </Button>

            {/* Notification Bell */}
            <button
              onClick={onToggleNotifications}
              className="relative p-2 rounded-xl text-[#64748B] hover:text-[#0F2747] hover:bg-[#F1F5F9] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#0D9488] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-[#E2E8F0] hover:border-[#0D9488]/40 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                aria-label="Profile menu"
              >
                <div className="w-7 h-7 rounded-lg bg-[#0F2747] text-white font-bold text-xs flex items-center justify-center">
                  EO
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-[#0F172A]">
                  Nexus Ops
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B] hidden sm:inline" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-[#F1F5F9]">
                    <p className="text-xs font-bold text-[#0F172A]">Nexus Event Productions</p>
                    <p className="text-[11px] text-[#64748B]">organizer@eventora.demo</p>
                  </div>
                  <div className="py-1 text-xs">
                    <button
                      onClick={() => {
                        onNavigate('organizer');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-[#0F172A] font-medium"
                    >
                      Organizer Dashboard
                    </button>
                    <div className="px-3 py-1 text-[11px] text-[#64748B] flex items-center justify-between">
                      <span>Status</span>
                      <span className="text-[#0D9488] font-semibold">Demo Workspace</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Role Workspaces
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Demo Workspace
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1">
            <button
              onClick={() => {
                onNavigate('landing');
                onToggleMobileMenu();
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                currentView === 'landing'
                  ? 'bg-[#E0F2FE] text-[#0F2747] font-semibold'
                  : 'text-[#64748B] hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4 text-[#0D9488]" />
              Platform Overview & Roles
            </button>
            <button
              onClick={() => {
                onNavigate('organizer');
                onToggleMobileMenu();
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                currentView === 'organizer'
                  ? 'bg-[#CCFBF1] text-[#0F766E] font-semibold'
                  : 'text-[#64748B] hover:bg-slate-50'
              }`}
            >
              <CalendarDays className="w-4 h-4 text-[#0D9488]" />
              Event Organizer Workspace
            </button>
            <button
              onClick={() => {
                onNavigate('artist');
                onToggleMobileMenu();
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                currentView === 'artist'
                  ? 'bg-[#CCFBF1] text-[#0F766E] font-semibold'
                  : 'text-[#64748B] hover:bg-slate-50'
              }`}
            >
              <Mic2 className="w-4 h-4 text-[#0D9488]" />
              Artist / Performer Workspace
            </button>
            <button
              onClick={() => {
                onNavigate('venue');
                onToggleMobileMenu();
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                currentView === 'venue'
                  ? 'bg-[#CCFBF1] text-[#0F766E] font-semibold'
                  : 'text-[#64748B] hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#0D9488]" />
              Venue Owner Workspace
            </button>
            <button
              onClick={() => {
                onNavigate('pricing');
                onToggleMobileMenu();
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                currentView === 'pricing'
                  ? 'bg-[#CCFBF1] text-[#0F766E] font-semibold'
                  : 'text-[#64748B] hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Proposed Pricing & Plans
            </button>
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search events, talent, venues..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-3 py-2.5 text-[#0F172A]"
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => {
                onOpenQuickAction();
                onToggleMobileMenu();
              }}
              icon={<Radio className="w-4 h-4" />}
            >
              Open Backup Radar Simulation
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
