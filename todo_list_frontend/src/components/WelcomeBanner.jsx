import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Welcome banner displayed near the top of the main view.
 * Shows a concise greeting and a short tip for quick task entry.
 * It is designed to be minimal and can be collapsed/hidden when tasks exist.
 */
function WelcomeBanner({ hasTasks = false }) {
  // When tasks exist, the banner becomes compact to avoid layout conflict.
  const compact = !!hasTasks;

  return (
    <section
      className={`banner banner-info welcome-banner ${compact ? 'welcome-compact' : ''}`}
      role="region"
      aria-label="Welcome message"
    >
      <div className="welcome-content">
        <p className="welcome-title">
          Welcome! Manage your tasks with ease.
        </p>
        {!compact && (
          <p className="welcome-tip" aria-live="polite">
            Tip: Press Enter to add a task.
          </p>
        )}
      </div>
    </section>
  );
}

export default WelcomeBanner;
