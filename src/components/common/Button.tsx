import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'mint' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 h-8',
    md: 'text-sm px-4 py-2 rounded-xl gap-2 h-10',
    lg: 'text-base px-6 py-2.5 rounded-xl gap-2.5 h-12',
  };

  const variantStyles = {
    primary:
      'bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-sm hover:shadow active:scale-[0.99]',
    secondary:
      'bg-[#0F2747] hover:bg-[#1A3860] text-white shadow-sm hover:shadow active:scale-[0.99]',
    outline:
      'bg-white border border-[#E2E8F0] hover:border-[#0D9488] text-[#0F172A] hover:text-[#0D9488] hover:bg-[#F8FAFC]',
    ghost:
      'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] active:bg-[#E2E8F0]',
    mint:
      'bg-[#CCFBF1] text-[#0F766E] hover:bg-[#99F6E4] font-semibold',
    danger:
      'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
