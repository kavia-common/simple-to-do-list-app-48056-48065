import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Bell/Notification icon for indicating new notifications.
 */
function BellIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.0"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 17H9a4 4 0 0 1-4-4v-1a7 7 0 0 1 14 0v1a4 4 0 0 1-4 4z" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
export default BellIcon;
