import React, { useState } from 'react';
import {
  CurrentView,
  UserRole,
  OrganizerTab,
  ArtistTab,
  VenueTab,
  NotificationItem,
} from './types';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { BackupRequestModal } from './components/common/BackupRequestModal';
import { LandingView } from './components/landing/LandingView';
import { OrganizerDashboard } from './components/dashboard/OrganizerDashboard';
import { ArtistDashboard } from './components/dashboard/ArtistDashboard';
import { VenueDashboard } from './components/dashboard/VenueDashboard';
import { PricingPage } from './components/pricing/PricingPage';
import {
  ArrowLeft,
  Radio,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('landing');
  const [organizerTab, setOrganizerTab] = useState<OrganizerTab>('overview');
  const [artistTab, setArtistTab] = useState<ArtistTab>('overview');
  const [venueTab, setVenueTab] = useState<VenueTab>('overview');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Emergency Dropout Alert',
      message: 'Solaris Beats grounded in Chicago. Neon Horizon Main Stage 20:30 needs immediate cover.',
      timestamp: '6 mins ago',
      type: 'urgent',
      read: false,
      roleTarget: 'organizer',
    },
    {
      id: 'notif-2',
      title: 'Standby Artist Matched',
      message: 'Echo Aurora (Electronic / Live Synth) accepted 45-min standby radius. ETA 22 mins.',
      timestamp: '14 mins ago',
      type: 'backup',
      read: false,
      roleTarget: 'artist',
    },
    {
      id: 'notif-3',
      title: 'Acoustic Limiter Calibrated',
      message: 'The Copper Vault dBA telemetry locked at 102 dBA ceiling for tonight’s sessions.',
      timestamp: '1 hour ago',
      type: 'confirmed',
      read: true,
      roleTarget: 'venue',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSelectRole = (role: UserRole) => {
    setCurrentView(role);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackupRequestSubmit = (request: {
    eventTitle: string;
    roleNeeded: string;
    urgency: string;
    timeLimit: string;
    location: string;
    budget: string;
  }) => {
    // Add real notification to feed
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Radar Ping: ${request.roleNeeded}`,
      message: `Emergency ping dispatched for ${request.eventTitle}. Urgency: ${request.urgency}. Compensation: ${request.budget}.`,
      timestamp: 'Just now',
      type: 'urgent',
      read: false,
      roleTarget: 'organizer',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#CCFBF1] selection:text-[#0F766E]">
      {/* Top Application Header (Hidden on desktop in Organizer view to match reference image layout) */}
      <div className={currentView === 'organizer' ? 'lg:hidden' : ''}>
        <Header
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          unreadCount={unreadCount}
          onToggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          onOpenQuickAction={() => setBackupModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Main View Area */}
      {currentView === 'landing' ? (
        <main className="flex-1">
          <LandingView
            onSelectRole={handleSelectRole}
            onOpenQuickAction={() => setBackupModalOpen(true)}
            onNavigateToPricing={() => setCurrentView('pricing')}
          />
        </main>
      ) : currentView === 'pricing' ? (
        <main className="flex-1">
          <PricingPage onNavigateToConsole={(view) => setCurrentView(view)} />
        </main>
      ) : (
        <div
          className={`flex-1 flex w-full ${
            currentView === 'organizer'
              ? 'max-w-none px-0 py-0 gap-0'
              : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6'
          }`}
        >
          {/* Desktop Role Sidebar */}
          <div className="hidden lg:block shrink-0">
            <Sidebar
              role={currentView}
              activeTab={
                currentView === 'organizer'
                  ? organizerTab
                  : currentView === 'artist'
                  ? artistTab
                  : venueTab
              }
              onTabChange={(tabId) => {
                if (currentView === 'organizer') {
                  if (tabId === 'pricing') {
                    setCurrentView('pricing');
                  } else {
                    setOrganizerTab(tabId as OrganizerTab);
                  }
                }
                if (currentView === 'artist') setArtistTab(tabId as ArtistTab);
                if (currentView === 'venue') setVenueTab(tabId as VenueTab);
              }}
              onSwitchRole={(newRole) => setCurrentView(newRole)}
              onNavigateToPricing={() => setCurrentView('pricing')}
            />
          </div>

          {/* Main Dashboard Workspace Content */}
          <main
            className={`flex-1 min-w-0 ${
              currentView === 'organizer' ? 'p-4 sm:p-6 lg:p-8 aurora-bg' : ''
            }`}
          >
            {/* Breadcrumb / Context Bar (Hidden in Organizer view which has its own top bar) */}
            {currentView !== 'organizer' && (
              <div className="mb-4 flex items-center justify-between text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView('landing')}
                    className="hover:text-[#0D9488] flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Overview
                  </button>
                  <span>/</span>
                  <span className="font-semibold text-[#0F172A] capitalize">
                    {currentView === 'artist'
                      ? 'Artist & Performer'
                      : 'Venue Owner'}{' '}
                    Console
                  </span>
                </div>

                {/* Mobile Role Switcher for small screens where sidebar is hidden */}
                <div className="lg:hidden flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E2E8F0]">
                  <button
                    onClick={() => setCurrentView('organizer')}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer text-[#64748B] hover:text-slate-900"
                  >
                    Org
                  </button>
                  <button
                    onClick={() => setCurrentView('artist')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                      currentView === 'artist'
                        ? 'bg-[#0D9488] text-white'
                        : 'text-[#64748B]'
                    }`}
                  >
                    Artist
                  </button>
                  <button
                    onClick={() => setCurrentView('venue')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                      currentView === 'venue'
                        ? 'bg-[#0D9488] text-white'
                        : 'text-[#64748B]'
                    }`}
                  >
                    Venue
                  </button>
                </div>
              </div>
            )}

            {/* Render Selected Role Workspace */}
            {currentView === 'organizer' && (
              <OrganizerDashboard
                activeTab={organizerTab}
                onTabChange={(tab) => {
                  if (tab === 'date-rescue') {
                    setBackupModalOpen(true);
                  } else if (tab === 'pricing') {
                    setCurrentView('pricing');
                  } else {
                    setOrganizerTab(tab);
                  }
                }}
                onOpenBackupModal={() => setBackupModalOpen(true)}
                onNavigateToPricing={() => setCurrentView('pricing')}
                onToggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}

            {currentView === 'artist' && (
              <ArtistDashboard
                activeTab={artistTab}
                onTabChange={(tab) => setArtistTab(tab)}
                onOpenDateRescue={() => setBackupModalOpen(true)}
              />
            )}

            {currentView === 'venue' && (
              <VenueDashboard
                activeTab={venueTab}
                onTabChange={(tab) => setVenueTab(tab)}
                onOpenDateRescue={() => setBackupModalOpen(true)}
              />
            )}
          </main>
        </div>
      )}

      {/* Global Bottom Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-6 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#0F2747] text-[#CCFBF1] flex items-center justify-center font-bold text-[10px]">
              E
            </div>
            <span className="font-bold text-[#0F2747]">EVENTORA</span>
            <span>— Every Event. Every Talent. One Network.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[#0D9488] font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#0D9488] inline-block animate-pulse" />
              Demo Workspace Active
            </span>
            <button
              onClick={() => setCurrentView('landing')}
              className="hover:text-[#0F172A] cursor-pointer"
            >
              Role Selection
            </button>
            <button
              onClick={() => setCurrentView('organizer')}
              className="hover:text-[#0F172A] cursor-pointer"
            >
              Organizer Console
            </button>
            <button
              onClick={() => setCurrentView('artist')}
              className="hover:text-[#0F172A] cursor-pointer"
            >
              Performer Hub
            </button>
            <button
              onClick={() => setCurrentView('venue')}
              className="hover:text-[#0F172A] cursor-pointer"
            >
              Venue Console
            </button>
            <button
              onClick={() => setCurrentView('pricing')}
              className="text-[#0D9488] hover:text-[#0F766E] font-medium cursor-pointer"
            >
              Proposed Pricing
            </button>
          </div>
        </div>
      </footer>

      {/* Notification Drawer Popover */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDismiss={handleDismissNotification}
        onNavigateToRole={(role) => {
          setCurrentView(role);
          setNotificationsOpen(false);
        }}
      />

      {/* Emergency Backup Radar / Date Rescue Modal */}
      <BackupRequestModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
        onSubmit={handleBackupRequestSubmit}
        onViewMyBookings={() => {
          setCurrentView('organizer');
          setOrganizerTab('my-bookings');
        }}
      />
    </div>
  );
}
