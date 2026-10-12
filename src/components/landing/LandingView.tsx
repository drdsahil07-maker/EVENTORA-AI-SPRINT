import React from 'react';
import {
  CalendarDays,
  Mic2,
  Building2,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface LandingViewProps {
  onSelectRole: (role: UserRole) => void;
  onOpenQuickAction: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onSelectRole,
  onOpenQuickAction,
}) => {
  return (
    <div className="min-h-screen pb-16 bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 pb-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0F2747] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#0D9488]" />
          <span>Every Event. Every Talent. One Network.</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
          Every event deserves a{' '}
          <span className="text-[#0D9488]">backup plan.</span>
        </h1>

        <p className="text-base text-[#64748B] max-w-xl mx-auto">
          The simple booking and date rescue platform for Event Organizers, Artists, and Venues.
        </p>

        {/* Primary Action Button */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onSelectRole('organizer')}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Start as Event Organizer
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onOpenQuickAction}
            icon={<ShieldAlert className="w-4 h-4 text-[#0D9488]" />}
          >
            Try Date Rescue
          </Button>
        </div>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-[#0D9488]" />
            Verified performers
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#0D9488]" />
            Fast replacement
          </span>
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#0D9488]" />
            Direct venue booking
          </span>
        </div>
      </section>

      {/* Role Selection (3 Simple Cards) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="mb-4 text-center sm:text-left">
          <h2 className="text-lg font-bold text-[#0F172A]">
            Choose your role to get started
          </h2>
          <p className="text-xs text-[#64748B]">
            Switch roles anytime from the top navigation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Role 1: Event Organizer */}
          <Card
            hoverable
            onClick={() => onSelectRole('organizer')}
            className="flex flex-col justify-between border border-[#E2E8F0] hover:border-[#0D9488] bg-white transition-all p-6"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Event Organizer</h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Plan events, hire artists, and find fast replacements if a performer cancels.
                </p>
              </div>
            </div>

            <div className="pt-5">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                Organizer Dashboard
              </Button>
            </div>
          </Card>

          {/* Role 2: Artist / Performer */}
          <Card
            hoverable
            onClick={() => onSelectRole('artist')}
            className="flex flex-col justify-between border border-[#E2E8F0] hover:border-[#0D9488] bg-white transition-all p-6"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-[#0F2747] flex items-center justify-center">
                <Mic2 className="w-5 h-5 text-[#0D9488]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Artist / Performer</h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Accept gig enquiries, manage your calendar, and pick up last-minute show covers.
                </p>
              </div>
            </div>

            <div className="pt-5">
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                Artist Dashboard
              </Button>
            </div>
          </Card>

          {/* Role 3: Venue Owner */}
          <Card
            hoverable
            onClick={() => onSelectRole('venue')}
            className="flex flex-col justify-between border border-[#E2E8F0] hover:border-[#0D9488] bg-white transition-all p-6"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0F2747] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Venue Owner</h3>
                <p className="text-xs text-[#64748B] mt-1">
                  List your available dates, review booking requests, and manage stage bookings.
                </p>
              </div>
            </div>

            <div className="pt-5">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                Venue Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Date Rescue Highlight Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0F2747] to-[#0D9488] rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-lg">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#CCFBF1]">
              Instant Solution
            </span>
            <h3 className="text-xl font-bold">
              Got a last-minute cancellation?
            </h3>
            <p className="text-xs text-sky-100 leading-relaxed">
              Date Rescue matches you with nearby performers ready to fill your open slot today.
            </p>
          </div>

          <Button
            variant="mint"
            size="md"
            onClick={onOpenQuickAction}
            className="shrink-0 font-bold"
          >
            Launch Date Rescue
          </Button>
        </div>
      </section>
    </div>
  );
};
