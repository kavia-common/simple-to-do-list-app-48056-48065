import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ProgressStats renders daily and weekly progress indicators with accessible progress bars.
 *
 * Props:
 * - stats: { todayTotal, todayCompleted, weekTotal, weekCompleted }
 */
function ProgressStats({ stats = { todayTotal: 0, todayCompleted: 0, weekTotal: 0, weekCompleted: 0 } }) {
  const { todayTotal, todayCompleted, weekTotal, weekCompleted } = stats;

  const todayPct = todayTotal > 0 ? Math.min(100, Math.round((todayCompleted / todayTotal) * 100)) : 0;
  const weekPct = weekTotal > 0 ? Math.min(100, Math.round((weekCompleted / weekTotal) * 100)) : 0;

  return (
    <section className="section card" role="region" aria-label="Progress summary">
      <div className="progress-grid">
        <div className="progress-block" aria-label="Today progress">
          <div className="progress-header">
            <h2 className="progress-title">Today</h2>
            <span className="progress-count" aria-live="polite">
              {todayCompleted}/{todayTotal}
            </span>
          </div>
          <div
            className="progress-bar"
            role="progressbar"
            aria-label="Tasks completed today"
            aria-valuemin={0}
            aria-valuemax={todayTotal || 0}
            aria-valuenow={todayCompleted || 0}
            title={`${todayCompleted} of ${todayTotal} tasks completed today`}
          >
            <div className="progress-fill" style={{ width: `${todayPct}%` }} />
          </div>
        </div>

        <div className="progress-block" aria-label="This week progress">
          <div className="progress-header">
            <h2 className="progress-title">This Week</h2>
            <span className="progress-count" aria-live="polite">
              {weekCompleted}/{weekTotal}
            </span>
          </div>
          <div
            className="progress-bar"
            role="progressbar"
            aria-label="Tasks completed this week"
            aria-valuemin={0}
            aria-valuemax={weekTotal || 0}
            aria-valuenow={weekCompleted || 0}
            title={`${weekCompleted} of ${weekTotal} tasks completed this week`}
          >
            <div className="progress-fill" style={{ width: `${weekPct}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProgressStats;
