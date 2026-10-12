import React from 'react';

export type StatusVariant =
  | 'Pending'
  | 'Accepted'
  | 'Confirmed'
  | 'Rejected'
  | 'Cancelled'
  | 'secured'
  | 'seeking'
  | 'standby'
  | 'urgent'
  | 'active'
  | 'neutral';

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  StatusVariant,
  { label: string; dot: string; bg: string; text: string; border: string }
> = {
  Pending: {
    label: 'Pending',
    dot: 'bg-amber-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  Accepted: {
    label: 'Accepted',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  Confirmed: {
    label: 'Confirmed',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  Rejected: {
    label: 'Rejected',
    dot: 'bg-rose-500',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
  Cancelled: {
    label: 'Cancelled',
    dot: 'bg-slate-400',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
  },
  secured: {
    label: 'Accepted',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  seeking: {
    label: 'Pending',
    dot: 'bg-amber-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  standby: {
    label: 'Available',
    dot: 'bg-[#0D9488]',
    bg: 'bg-[#CCFBF1]',
    text: 'text-[#0F766E]',
    border: 'border-[#99F6E4]',
  },
  urgent: {
    label: 'Urgent',
    dot: 'bg-rose-500',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
  active: {
    label: 'Confirmed',
    dot: 'bg-[#0F2747]',
    bg: 'bg-[#E0F2FE]',
    text: 'text-[#0F2747]',
    border: 'border-sky-200',
  },
  neutral: {
    label: 'Standard',
    dot: 'bg-slate-400',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
}) => {
  const cfg = statusConfig[status] || statusConfig.neutral;
  const displayLabel = label || cfg.label;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md transition-colors ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      } ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      <span>{displayLabel}</span>
    </span>
  );
};
