import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Card container provides a surface block with Ocean Professional styling.
 * It supports accessible structure using article/section semantics.
 */
export function Card({ as: Tag = 'article', children, className = '', role, ariaLabel }) {
  return (
    <Tag
      className={`card ${className}`}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </Tag>
  );
}

/**
 * PUBLIC_INTERFACE
 * CardHeader renders a section header with appropriate semantics.
 */
export function CardHeader({ title, subtitle, actions = null, children, as: Tag = 'header', ariaLabel }) {
  return (
    <Tag className="card-header" aria-label={ariaLabel}>
      <div className="card-header-main">
        {title ? <h3 className="card-title">{title}</h3> : null}
        {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
        {children}
      </div>
      {actions ? <div className="card-actions">{actions}</div> : null}
    </Tag>
  );
}

/**
 * PUBLIC_INTERFACE
 * CardBody contains the primary content of a card.
 */
export function CardBody({ children, className = '' }) {
  return <div className={`card-body ${className}`}>{children}</div>;
}

/**
 * PUBLIC_INTERFACE
 * CardFooter renders a lightweight footer area for secondary actions/text.
 */
export function CardFooter({ children, className = '' }) {
  return <footer className={`card-footer ${className}`}>{children}</footer>;
}

export default Card;
