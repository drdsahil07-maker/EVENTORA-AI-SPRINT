import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Star,
  Users,
  Building,
  ArrowRight,
  Info,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../common/Button';
import { CurrentView, UserRole } from '../../types';

interface PricingPageProps {
  onNavigateToConsole: (view: CurrentView) => void;
}

export type PricingTierId = 'free-artist' | 'seasonal-pass' | 'premium-artist' | 'pro-organizer';

interface PricingTier {
  id: PricingTierId;
  name: string;
  badge?: string;
  priceINR: number;
  period: string;
  targetRole: string;
  description: string;
  features: string[];
  ctaLabel: string;
  popular?: boolean;
  accentColor?: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free-artist',
    name: 'Free Artist',
    priceINR: 0,
    period: 'forever',
    targetRole: 'Emerging Performers',
    description: 'Basic profile presence and direct organizer booking inquiries.',
    features: [
      'Basic talent portfolio & bio listing',
      'Receive standard direct organizer enquiries',
      'Simple date availability calendar',
      'Public review & rating display',
      'Standard community support',
    ],
    ctaLabel: 'Select Free Plan',
  },
  {
    id: 'seasonal-pass',
    name: 'Seasonal Pass',
    badge: 'Popular for Gigs',
    priceINR: 199,
    period: 'proposed / month',
    targetRole: 'Active Gigging Artists',
    description: 'Open-date opportunities and seasonal festival and wedding matching.',
    features: [
      'Access to open-date gig opportunities board',
      'Seasonal wedding & college festival matching',
      'Instant SMS & email enquiry notifications',
      'Multi-city coverage (up to 3 service areas)',
      'Calendar hold and release controls',
    ],
    ctaLabel: 'Choose Seasonal Pass',
  },
  {
    id: 'premium-artist',
    name: 'Premium Artist',
    badge: 'Most Popular',
    priceINR: 499,
    period: 'proposed / month',
    targetRole: 'Touring Performers & Bands',
    description: 'Priority discovery matching and real-time cancellation recovery alerts.',
    popular: true,
    features: [
      'Top-tier placement in organizer search results',
      'Real-time Date Rescue priority radar pings',
      'Cancellation recovery alerts within 30-min window',
      'Verified Talent badge & fast response tag',
      'Dedicated technical rider & PA specs passport',
      'Direct contact routing for urgent dates',
    ],
    ctaLabel: 'Choose Premium Artist',
  },
  {
    id: 'pro-organizer',
    name: 'Organizer / Venue Pro',
    badge: 'For Planners & Spaces',
    priceINR: 699,
    period: 'proposed / month',
    targetRole: 'Event Planners & Venues',
    description: 'Urgent backup search with Date Rescue and centralized booking pipeline.',
    features: [
      'Unlimited urgent backup search with Date Rescue engine',
      'Centralized multi-stage booking & hold management',
      'Real-time budget tracking & remaining allocation telemetry',
      'Venue acoustic & decibel limiter specifications drawer',
      'Priority standby artist dispatch broadcast',
      'Audit log of all booking requests and status updates',
    ],
    ctaLabel: 'Choose Organizer / Venue Pro',
  },
];

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigateToConsole }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<PricingTierId>(() => {
    try {
      const stored = localStorage.getItem('eventora_active_plan_tier');
      if (stored) return stored as PricingTierId;
    } catch {
      // ignore
    }
    return 'free-artist';
  });

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSelectPlan = (tier: PricingTier) => {
    setSelectedPlanId(tier.id);
    try {
      localStorage.setItem('eventora_active_plan_tier', tier.id);
    } catch {
      // ignore
    }
    setToastMessage(`Demo Plan activated: "${tier.name}". Simulation mode active — no payment required.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-[#CCFBF1] border border-[#99F6E4] text-[#0F766E] p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-md animate-in fade-in sticky top-20 z-30">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#0D9488]" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="font-bold text-sm cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#E0F2FE] text-[#0F2747] px-3 py-1 rounded-full text-xs font-bold border border-[#BAE6FD]">
          <Sparkles className="w-3.5 h-3.5 text-[#0D9488]" />
          <span>PROPOSED DEMO PRICING · NO PAYMENT REQUIRED</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          Simple tiers for every talent and event.
        </h1>

        <p className="text-sm text-[#64748B] leading-relaxed">
          Select any proposed plan below to test tier features in simulation mode. No credit card or real transaction is executed.
        </p>

        {/* Simulated Billing Frequency Switcher */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <div className="inline-flex items-center p-1 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#0D9488] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-[#0D9488] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Annual Billing
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#CCFBF1] text-[#0F766E] font-extrabold">
                -20% proposed
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRICING_TIERS.map((tier) => {
          const isSelected = selectedPlanId === tier.id;
          const displayPrice =
            billingCycle === 'annual' && tier.priceINR > 0
              ? Math.round(tier.priceINR * 0.8)
              : tier.priceINR;

          return (
            <div
              key={tier.id}
              className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                tier.popular
                  ? 'border-[#0D9488] shadow-md ring-2 ring-[#0D9488]/30'
                  : isSelected
                  ? 'border-[#0D9488] shadow-sm'
                  : 'border-[#E2E8F0] shadow-2xs hover:border-slate-300'
              }`}
            >
              {/* Optional Popular Ribbon */}
              {tier.popular && (
                <div className="bg-[#0D9488] text-white text-[10px] font-black uppercase tracking-wider py-1 text-center">
                  {tier.badge || 'Most Popular'}
                </div>
              )}

              <div className="p-6 space-y-4">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                      {tier.targetRole}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-extrabold bg-[#CCFBF1] text-[#0F766E] px-2 py-0.5 rounded-full border border-[#99F6E4]">
                        Active Plan
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0F172A] mt-1">{tier.name}</h3>
                  <p className="text-xs text-[#64748B] mt-1 min-h-[32px] leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="pt-2 border-t border-[#F1F5F9]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#0F172A]">
                      ₹{displayPrice}
                    </span>
                    <span className="text-xs text-[#64748B]">
                      {tier.period === 'forever' ? '/ forever' : '/ mo'}
                    </span>
                  </div>
                  <div className="text-[10px] font-semibold text-[#0D9488] mt-0.5">
                    Proposed demo tier rate
                  </div>
                </div>

                {/* Features List */}
                <div className="pt-3 border-t border-[#F1F5F9] space-y-2.5">
                  <span className="text-[11px] font-bold text-[#0F172A] block uppercase tracking-wider">
                    Included Capabilities:
                  </span>
                  <ul className="space-y-2 text-xs text-[#475569]">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-snug">
                        <Check className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <Button
                  variant={isSelected ? 'secondary' : tier.popular ? 'primary' : 'outline'}
                  size="md"
                  className="w-full justify-center"
                  onClick={() => handleSelectPlan(tier)}
                  icon={isSelected ? <Check className="w-4 h-4" /> : undefined}
                >
                  {isSelected ? 'Active Plan' : tier.ctaLabel}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Demo Disclosure Box */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 text-xs text-[#64748B] space-y-2 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-[#0F172A] font-bold">
          <Info className="w-4 h-4 text-[#0D9488]" />
          <span>Demo Mode & Non-Guarantee Terms</span>
        </div>
        <p className="leading-relaxed">
          All prices shown are proposed rates for hackathon demonstration. Plan selection operates in local simulation mode without payment processing or subscription binding.
        </p>
        <p className="leading-relaxed">
          <strong>Non-Guarantee Policy:</strong> Eventora connects event organizers, performers, and venues. Gigs and bookings depend upon mutual availability and organizer-performer agreement. Eventora does not guarantee confirmed bookings, minimum gig earnings, or contractual cancellation compensation.
        </p>
      </div>

      {/* Quick Launch Back to Workspaces */}
      <div className="text-center pt-2">
        <span className="text-xs text-[#64748B] block mb-3">
          Ready to jump back into your workspace?
        </span>
        <div className="inline-flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateToConsole('organizer')}
            icon={<Users className="w-4 h-4" />}
          >
            Organizer Console
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateToConsole('artist')}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Artist Hub
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateToConsole('venue')}
            icon={<Building className="w-4 h-4" />}
          >
            Venue Console
          </Button>
        </div>
      </div>
    </div>
  );
};
