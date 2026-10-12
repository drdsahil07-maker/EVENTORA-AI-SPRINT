import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  aurora?: boolean;
  padded?: boolean;
  colSpan?: 1 | 2 | 3 | 4;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  aurora = false,
  padded = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white border border-[#E2E8F0] rounded-2xl shadow-xs transition-all duration-200 overflow-hidden ${
        padded ? 'p-6' : ''
      } ${
        hoverable
          ? 'hover:shadow-md hover:border-[#0D9488]/40 hover:-translate-y-0.5 cursor-pointer'
          : ''
      } ${aurora ? 'aurora-card-glow' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
    <div>
      <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
