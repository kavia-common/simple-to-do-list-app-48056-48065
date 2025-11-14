import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Icon is a thin wrapper around inline SVGs to standardize sizing, color, and accessibility.
 * Icons use currentColor so color can be controlled via CSS classes on the parent/button.
 */
function Icon({ children, size = 20, className = '', title = null, ...rest }) {
  return (
    <span
      className={className}
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      {...rest}
      style={{ display: 'inline-flex', width: size, height: size, lineHeight: 0, alignItems: 'center', justifyContent: 'center', ...(rest.style || {}) }}
    >
      {React.cloneElement(children, {
        width: size,
        height: size,
        'aria-hidden': title ? undefined : true,
        focusable: 'false',
        style: { display: 'block', color: 'currentColor' },
      })}
      {title ? <span className="sr-only">{title}</span> : null}
    </span>
  );
}

export default Icon;
