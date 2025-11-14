import React from 'react';

/**
 * PUBLIC_INTERFACE
 * CheckCircle icon indicates completion.
 */
function CheckCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12.5l2 2 4-4" />
    </svg>
  );
}
export default CheckCircleIcon;
