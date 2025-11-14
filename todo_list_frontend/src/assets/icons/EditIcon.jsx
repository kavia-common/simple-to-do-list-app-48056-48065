import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Edit icon (pencil) for editing tasks.
 */
function EditIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z" />
    </svg>
  );
}
export default EditIcon;
