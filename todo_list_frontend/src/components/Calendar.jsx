import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * Calendar component: lightweight, dependency-free month view with accessibility.
 * - Highlights days with tasks (createdAt/completedAt)
 * - Month navigation (prev/next) and Today shortcut
 * - Keyboard navigation within grid (arrow keys, Home/End, PageUp/PageDown)
 * - Clicking a day toggles date filter via onSelectDate(date | null)
 *
 * Props:
 * - todos: array of tasks with createdAt (ms) and optional completedAt (ms)
 * - selectedDate: Date | null (current selected filter date)
 * - onSelectDate: (Date|null) => void
 * - className: optional className for container
 */
function Calendar({ todos = [], selectedDate = null, onSelectDate, className = '' }) {
  // focusDate drives keyboard focus within the grid; defaults to today or selectedDate
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  }, []);
  const [viewYearMonth, setViewYearMonth] = useState(() => {
    const base = selectedDate || today;
    return { y: base.getFullYear(), m: base.getMonth() };
  });
  const [focusDate, setFocusDate] = useState(() => selectedDate || today);

  useEffect(() => {
    // When external selectedDate changes, adjust focus and month view
    if (selectedDate) {
      setFocusDate(selectedDate);
      setViewYearMonth({ y: selectedDate.getFullYear(), m: selectedDate.getMonth() });
    }
  }, [selectedDate]);

  const firstOfMonth = useMemo(() => new Date(viewYearMonth.y, viewYearMonth.m, 1), [viewYearMonth]);
  const lastOfMonth = useMemo(() => new Date(viewYearMonth.y, viewYearMonth.m + 1, 0), [viewYearMonth]);

  // Generate weeks (Sun-Sat) covering the month view
  const weeks = useMemo(() => {
    const startDay = firstOfMonth.getDay(); // 0=Sun
    const startDate = new Date(viewYearMonth.y, viewYearMonth.m, 1 - startDay);
    const out = [];
    let current = new Date(startDate);
    for (let w = 0; w < 6; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        week.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      out.push(week);
    }
    // Trim trailing week if all days are next month and month only spans 5 weeks
    const lastWeek = out[out.length - 1];
    const allNextMonth = lastWeek.every(
      (d) => d.getMonth() !== firstOfMonth.getMonth()
    );
    if (allNextMonth) out.pop();
    return out;
  }, [firstOfMonth, viewYearMonth]);

  // Build per-day aggregates for created/completed counts
  const dayIndicators = useMemo(() => {
    const map = new Map(); // key: 'YYYY-MM-DD' -> { created: n, completed: n }
    const add = (date, field) => {
      if (date == null) return;
      const dd = new Date(date);
      const key = `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, '0')}-${String(dd.getDate()).padStart(2, '0')}`;
      const curr = map.get(key) || { created: 0, completed: 0 };
      curr[field] += 1;
      map.set(key, curr);
    };
    for (const t of todos) {
      if (t?.createdAt != null) add(Number(t.createdAt), 'created');
      if (t?.completedAt != null) add(Number(t.completedAt), 'completed');
    }
    return map;
  }, [todos]);

  const formatKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const goPrevMonth = () => {
    setViewYearMonth((vm) => {
      const m = vm.m - 1;
      return m < 0 ? { y: vm.y - 1, m: 11 } : { y: vm.y, m };
    });
  };
  const goNextMonth = () => {
    setViewYearMonth((vm) => {
      const m = vm.m + 1;
      return m > 11 ? { y: vm.y + 1, m: 0 } : { y: vm.y, m };
    });
  };
  const goToday = () => {
    setViewYearMonth({ y: today.getFullYear(), m: today.getMonth() });
    setFocusDate(today);
    onSelectDate?.(today);
  };

  // Keyboard navigation handling on the grid
  const gridRef = useRef(null);
  const onKeyDown = (e) => {
    const key = e.key;
    let next = new Date(focusDate);
    const isSameMonthView = (d) => d.getMonth() === viewYearMonth.m && d.getFullYear() === viewYearMonth.y;
    let changed = false;
    if (key === 'ArrowRight') {
      next.setDate(next.getDate() + 1); changed = true;
    } else if (key === 'ArrowLeft') {
      next.setDate(next.getDate() - 1); changed = true;
    } else if (key === 'ArrowDown') {
      next.setDate(next.getDate() + 7); changed = true;
    } else if (key === 'ArrowUp') {
      next.setDate(next.getDate() - 7); changed = true;
    } else if (key === 'Home') {
      // move to first day of week (Sunday)
      next.setDate(next.getDate() - next.getDay()); changed = true;
    } else if (key === 'End') {
      // move to last day of week (Saturday)
      next.setDate(next.getDate() + (6 - next.getDay())); changed = true;
    } else if (key === 'PageUp') {
      next.setMonth(next.getMonth() - 1); changed = true;
    } else if (key === 'PageDown') {
      next.setMonth(next.getMonth() + 1); changed = true;
    } else if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      handleSelect(focusDate);
      return;
    }
    if (changed) {
      e.preventDefault();
      setFocusDate(next);
      // If moved outside current view, update month
      if (!isSameMonthView(next)) {
        setViewYearMonth({ y: next.getFullYear(), m: next.getMonth() });
      }
    }
  };

  const sameDay = (a, b) =>
    a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const handleSelect = (date) => {
    if (selectedDate && sameDay(selectedDate, date)) {
      onSelectDate?.(null); // toggle off
      return;
    }
    onSelectDate?.(date);
  };

  const monthLabel = useMemo(() => {
    const dt = new Date(viewYearMonth.y, viewYearMonth.m, 1);
    return dt.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  }, [viewYearMonth]);

  const weekdayLabels = useMemo(() => {
    const base = new Date(2021, 7, 1); // Sunday
    return Array.from({ length: 7 }, (_, i) =>
      new Date(base.getFullYear(), base.getMonth(), base.getDate() + i).toLocaleString(undefined, { weekday: 'short' })
    );
  }, []);

  return (
    <section className={`calendar card ${className}`} role="region" aria-label="Calendar">
      <header className="card-header" aria-label="Calendar header">
        <div className="card-header-main">
          <h3 className="card-title">Calendar</h3>
          <p className="card-subtitle">Visualize created and completed tasks</p>
        </div>
        <div className="card-actions">
          <button type="button" className="btn btn-secondary" onClick={goPrevMonth} aria-label="Previous month" title="Previous month">
            ‹
          </button>
          <div aria-live="polite" style={{ alignSelf: 'center', minWidth: 140, textAlign: 'center', fontWeight: 600 }}>
            {monthLabel}
          </div>
          <button type="button" className="btn btn-secondary" onClick={goNextMonth} aria-label="Next month" title="Next month">
            ›
          </button>
          <button type="button" className="btn btn-primary" onClick={goToday} aria-label="Go to today" title="Go to today">
            Today
          </button>
        </div>
      </header>

      <div className="card-body">
        <div
          className="calendar-grid"
          role="grid"
          aria-labelledby="calendar-label"
          aria-describedby="calendar-hint"
          tabIndex={0}
          onKeyDown={onKeyDown}
          ref={gridRef}
        >
          <div id="calendar-label" className="sr-only">Use arrow keys to navigate days. Press Enter to select date.</div>
          <div id="calendar-hint" className="sr-only">Dots indicate created and completed tasks per day.</div>

          <div className="calendar-weekdays" aria-hidden="true">
            {weekdayLabels.map((w) => (
              <div key={w} className="calendar-weekday">
                {w}
              </div>
            ))}
          </div>

          <div className="calendar-weeks">
            {weeks.map((week, wi) => (
              <div className="calendar-row" role="row" key={`w${wi}`}>
                {week.map((d, di) => {
                  const inMonth = d.getMonth() === firstOfMonth.getMonth();
                  const isToday = sameDay(d, today);
                  const isSelected = selectedDate ? sameDay(d, selectedDate) : false;
                  const isFocused = sameDay(d, focusDate);
                  const key = formatKey(d);
                  const counts = dayIndicators.get(key) || { created: 0, completed: 0 };

                  return (
                    <button
                      key={key}
                      type="button"
                      role="gridcell"
                      aria-selected={isSelected}
                      className={`calendar-day${inMonth ? '' : ' is-out'}${isToday ? ' is-today' : ''}${isSelected ? ' is-selected' : ''}`}
                      onClick={() => handleSelect(d)}
                      onFocus={() => setFocusDate(d)}
                      tabIndex={isFocused ? 0 : -1}
                      title={`${d.toDateString()} • ${counts.created} created • ${counts.completed} completed`}
                      aria-label={`${d.toDateString()}. ${counts.created} created, ${counts.completed} completed.`}
                    >
                      <span className="calendar-date">{d.getDate()}</span>
                      <span className="calendar-dots" aria-hidden="true">
                        {counts.created > 0 ? <span className="dot dot-created" /> : null}
                        {counts.completed > 0 ? <span className="dot dot-completed" /> : null}
                        {counts.created > 2 || counts.completed > 2 ? (
                          <span className="dot-count">{counts.created + counts.completed}</span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="calendar-legend" aria-hidden="true">
          <span className="legend-item"><span className="dot dot-created" /> Created</span>
          <span className="legend-item"><span className="dot dot-completed" /> Completed</span>
        </div>
      </div>
    </section>
  );
}

export default Calendar;
