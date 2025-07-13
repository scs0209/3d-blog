import React from 'react';

export function NeonToggle({
  checked,
  onChange,
  label,
  disabled = false,
}: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  const id = React.useId();
  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-2 cursor-pointer select-none ${disabled ? 'opacity-50' : ''}`}
    >
      <input
        id={id}
        type='checkbox'
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
        className='sr-only'
      />
      <span
        tabIndex={disabled ? -1 : 0}
        aria-checked={checked}
        aria-disabled={disabled}
        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${checked ? 'border-[#E5D6C4] bg-[#E5D6C4] shadow-[0_0_8px_2px_#ec4]' : 'border-[#E5D6C4] bg-black'}`}
        style={{
          boxShadow: checked ? '0 0 12px 2px #ec4, 0 0 4px 1px #ec4 inset' : '0 0 4px 1px #ec4 inset',
        }}
        onClick={(e) => {
          e.preventDefault();
          if (!disabled) {
            onChange(!checked);
          }
        }}
        onKeyDown={(e) => {
          if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault();
            onChange(!checked);
          }
        }}
      >
        {checked && (
          <svg width='18' height='18' viewBox='0 0 18 18' className='text-pink-200' aria-label='checked'>
            <title>checked</title>
            <polyline
              points='4,10 8,14 14,6'
              fill='none'
              stroke='#ec4'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
              style={{ filter: 'drop-shadow(0 0 4px #ec4)' }}
            />
          </svg>
        )}
      </span>
      <span className='text-[#E5D6C4] font-mono neon-glow text-sm'>{label}</span>
    </label>
  );
}
