'use client';

import React, { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color?: 'black';
  textColor?: string;
  size?: 'sm' | 'md';
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  color = 'black',
  textColor = 'text-white',
  size = 'md',
  type = 'button',
  fullWidth = false,
}) => {
  const bgClass = 'bg-black hover:bg-[#1a1a1a]';
  // 将来的に他の色を追加する場合
  // if (color === 'blue') bgClass = 'bg-blue-600 hover:bg-blue-700';

  let sizeClass = 'px-3 py-2 text-base rounded-xl';
  if (size === 'sm') sizeClass = 'px-4 py-3 text-sm rounded-lg';

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClass} ${bgClass} ${textColor} ${widthClass} ${disabledClass} font-medium transition-all duration-150`}
    >
      {children}
    </button>
  );
};
