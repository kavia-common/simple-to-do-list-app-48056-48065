import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Circle icon indicates an incomplete task.
 */
function CircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
export default CircleIcon;
