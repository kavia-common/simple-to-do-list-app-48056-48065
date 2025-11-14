import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Sun icon for light mode.
 */
function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l-1.5-1.5M20.5 20.5L19 19M19 5l1.5-1.5M5 19L3.5 20.5" />
    </svg>
  );
}
export default SunIcon;
