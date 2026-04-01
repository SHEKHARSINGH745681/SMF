import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, PointElement, LineElement,
  ArcElement, Filler, Tooltip, Legend,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import "./TeacherDashboard.css";

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Filler, Tooltip, Legend
);

/* ─── Icon helper ─── */
const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", sw = "1.8", children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>
);
const ChevronLeft  = ({ size = 16 }) => <Icon size={size} d="M15 18l-6-6 6-6" />;
const ChevronRight = ({ size = 16 }) => <Icon size={size} d="M9 18l6-6-6-6" />;
const ChevronDown  = ({ size = 16 }) => <Icon size={size} d="M6 9l6 6 6-6" />;

/* ─── Nav Items ─── */
const NAV_ITEMS = [
  {
    key: "dashboard", label: "Dashboard",
    icon: <Icon fill="currentColor" stroke="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="currentColor" strokeWidth="1.8"/></Icon>,
  },
  {
    key: "teachers", label: "Teachers",
    icon: <Icon><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></Icon>,
    hasArrow: true,
  },
  {
    key: "students", label: "Students",
    icon: <Icon><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>,
    hasArrow: true,
  },
  {
    key: "attendance", label: "Attendance",
    icon: <Icon><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></Icon>,
    hasArrow: true,
  },
  {
    key: "finance", label: "Finance",
    icon: <Icon><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></Icon>,
    hasArrow: true,
  },
  {
    key: "notice", label: "Notice",
    icon: <Icon><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Icon>,
  },
  {
    key: "calendar", label: "Calendar",
    icon: <Icon><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Icon>,
  },
  {
    key: "library", label: "Library",
    icon: <Icon><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></Icon>,
  },
  {
    key: "message", label: "Message",
    icon: <Icon><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></Icon>,
  },
];
const OTHER_ITEMS = [
  { key: "profile", label: "Profile", icon: <Icon><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></Icon> },
  { key: "setting", label: "Setting", icon: <Icon><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></Icon> },
  { key: "logout",  label: "Log out", icon: <Icon><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>, danger: true },
];

const WEEK_DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

/* ─── Static data ─── */
const STAT_CARDS = [
  { label: "Total Classes",   value: "147",        trend: "up",   pct: "15%", color: "#3B82F6" },
  { label: "Total Students",  value: "3,250",       trend: "down", pct: "5%",  color: "#F97316" },
  { label: "Total Hours",     value: "104,687",     trend: "down", pct: "10%", color: "#10B981" },
  { label: "Total Income",    value: "₹ 1,682,500",  trend: "up",   pct: "23%", color: "#A855F7" },
];

/* Attendance donut */
const attendDonutData = {
  datasets: [{
    data: [80, 20],
    backgroundColor: ["#C4B5FD", "#FCD34D"],
    borderWidth: 0,
    hoverOffset: 4,
  }],
};
const attendDonutOpts = {
  responsive: false,
  cutout: "76%",
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
};

/* Performance grouped bar */
const perfData = {
  labels: ["Mon","Tue","Wed","Thu","Fri"],
  datasets: [
    { label: "Class 10", data: [75, 65, 80, 55, 70], backgroundColor: "#93C5FD", borderRadius: 4, barThickness: 10 },
    { label: "Class 11", data: [60, 72, 65, 75, 62], backgroundColor: "#C4B5FD", borderRadius: 4, barThickness: 10 },
    { label: "Class 12", data: [80, 78, 70, 68, 85], backgroundColor: "#FCD34D", borderRadius: 4, barThickness: 10 },
  ],
};
const perfOpts = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1200, easing: "easeOutQuart" },
  plugins: {
    legend: { display: false },
    tooltip: { mode: "index", intersect: false },
  },
  scales: {
    x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 }, color: "#98A2B3" } },
    y: {
      grid: { color: "#F2F4F7" }, border: { display: false },
      ticks: { font: { size: 10 }, color: "#98A2B3", stepSize: 25 },
      min: 0, max: 100,
    },
  },
};

/* Teaching/Engagement Activity line */
const activityData = {
  labels: ["Apr 1","Apr 5","Apr 10","Apr 15","Apr 20","Apr 25","Apr 30"],
  datasets: [{
    label: "Working Hours",
    data: [60, 80, 100, 90, 130, 110, 120],
    borderColor: "#FCD34D",
    backgroundColor: "rgba(252,211,77,0.18)",
    tension: 0.5,
    borderWidth: 2.5,
    pointRadius: (ctx) => ctx.dataIndex === 5 ? 6 : 0,
    pointBackgroundColor: "#FCD34D",
    fill: true,
  }],
};
const activityOpts = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1400, easing: "easeOutCubic" },
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: "index", intersect: false,
      callbacks: { label: (c) => `Working Hours: ${c.raw} Hours` },
    },
  },
  scales: {
    x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 }, color: "#98A2B3" } },
    y: {
      grid: { color: "#F2F4F7" }, border: { display: false },
      ticks: { font: { size: 10 }, color: "#98A2B3", stepSize: 40 },
      min: 40, max: 160,
    },
  },
};

const TASKS_INIT = [
  { id: 1, name: "Grade Student Essays",         date: "April 24, 2024", done: false },
  { id: 2, name: "Update Lesson Plans",           date: "April 25, 2024", done: true  },
  { id: 3, name: "Attend Department Meeting",     date: "April 26, 2024", done: true  },
  { id: 4, name: "Prepare Science Quiz",          date: "April 27, 2024", done: false },
  { id: 5, name: "Submit Attendance Report",      date: "April 28, 2024", done: false },
  { id: 6, name: "Review Curriculum Changes",     date: "April 29, 2024", done: false },
];

const AGENDA = [
  { subject: "History 11 AP World History", time: "8:00 AM – 9:00 AM",    title: "Review Recent Test Results", color: "#3B82F6" },
  { subject: "History 12",                  time: "10:00 AM – 11:30 AM",  title: "Lecture on Cold War",        color: "#F97316" },
  { subject: "History 10A",                 time: "4:30 PM – 5:30 PM",    title: "Prepare for Tomorrow's Debate", color: "#A855F7" },
];

/* ─── Task Item ─── */
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className="pd-task-item">
      <div
        className={`pd-task-check${task.done ? " checked" : ""}`}
        onClick={() => onToggle(task.id)}
      />
      <div className="pd-task-body">
        <div className={`pd-task-name${task.done ? " done" : ""}`}>{task.name}</div>
        <div className="pd-task-date">{task.date}</div>
      </div>
      <div className="pd-task-actions">
        <button className="pd-task-action-btn">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button className="pd-task-action-btn del" onClick={() => onDelete(task.id)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function ParentDashboard({ username = "Heaters Morris" }) {
  const today = new Date();
  const [activePage, setActivePage]           = useState("dashboard");
  const [collapsed,  setCollapsed]             = useState(false);
  const [tasks,      setTasks]                 = useState(TASKS_INIT);
  const [taskSearch, setTaskSearch]            = useState("");
  const [calendarMonthStart, setCalendarMonthStart] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  /* calendar helpers */
  const calendarTitle   = calendarMonthStart.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDay        = calendarMonthStart.getDay();
  const daysInMonth     = new Date(calendarMonthStart.getFullYear(), calendarMonthStart.getMonth() + 1, 0).getDate();
  const cells           = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const trailing        = (7 - (cells.length % 7)) % 7;
  const calendarGrid    = [...cells, ...Array(trailing).fill(null)];
  const isCurMonth      = calendarMonthStart.getFullYear() === today.getFullYear()
                        && calendarMonthStart.getMonth() === today.getMonth();

  const initials = username.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();

  const toggleTask = (id) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id) => setTasks(ts => ts.filter(t => t.id !== id));
  const addTask    = () => {
    const name = prompt("New task name:");
    if (!name?.trim()) return;
    const d = new Date(); const month = d.toLocaleString("default",{month:"long"});
    setTasks(ts => [...ts, { id: Date.now(), name: name.trim(), date: `${month} ${d.getDate()}, ${d.getFullYear()}`, done: false }]);
  };

  const filteredTasks = tasks.filter(t =>
    t.name.toLowerCase().includes(taskSearch.toLowerCase())
  );

  return (
    <div className="pd-layout">
      {/* ── Sidebar ── */}
      <aside className={`pd-sidebar${collapsed ? " collapsed" : ""}`}>
        <div className="pd-logo">
          <div className="pd-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          {!collapsed && <span className="pd-logo-text">SchoolHub</span>}
          <button className="pd-collapse-btn" onClick={() => setCollapsed(v => !v)}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        <nav className="pd-nav">
          {!collapsed && <div className="pd-nav-label">Menu</div>}
          {NAV_ITEMS.map(item => (
            <div className="pd-nav-group" key={item.key}>
              <button
                className={`pd-nav-item${activePage === item.key ? " active" : ""}`}
                onClick={() => setActivePage(item.key)}
                title={collapsed ? item.label : ""}
              >
                <span className="pd-nav-icon">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="pd-nav-label-text">{item.label}</span>
                    {item.hasArrow && <span className="pd-nav-arrow"><ChevronRight size={14} /></span>}
                  </>
                )}
              </button>
            </div>
          ))}

          <div className="pd-nav-spacer" />
          {!collapsed && <div className="pd-nav-label">Other</div>}
          {OTHER_ITEMS.map(item => (
            <button key={item.key} className={`pd-nav-item${item.danger ? " danger" : ""}`} title={collapsed ? item.label : ""}>
              <span className="pd-nav-icon">{item.icon}</span>
              {!collapsed && <span className="pd-nav-label-text">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="pd-main">
        {/* Topbar */}
        <header className="pd-topbar">
          <div className="pd-search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search..." />
          </div>
          <div className="pd-topbar-right">
            <button className="pd-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </button>
            <button className="pd-icon-btn pd-notif-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <span className="pd-notif-dot" />
            </button>
            <div className="pd-topbar-user">
              <div className="pd-user-avatar">{initials}</div>
              <div>
                <div className="pd-user-name">{username}</div>
                <div className="pd-user-role">Teacher</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="pd-content">
          <div className="pd-dashboard-body">
            {/* ── Center Column ── */}
            <div className="pd-center-col">

              {/* Banner */}
              <div className="pd-banner">
                <div className="pd-banner-text">
                  <div className="pd-banner-heading">
                    Your child's classes are improving<br />
                    great about 30% than last year 🎉
                  </div>
                  <div className="pd-banner-meta">
                    <div className="pd-banner-meta-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                      heatersmorris@mail.com
                    </div>
                    <div className="pd-banner-meta-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.28-1.28a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                      </svg>
                      +28 1234 5678
                    </div>
                  </div>
                </div>
                <div className="pd-banner-img">
                  <div className="pd-banner-illustration">
                    <div className="pd-banner-circle1" />
                    <div className="pd-banner-circle2" />
                    <span className="pd-banner-emoji">👩‍👧</span>
                  </div>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="pd-stats-grid">
                {STAT_CARDS.map((s, i) => (
                  <div className="pd-stat-card" key={i}>
                    <div className="pd-stat-label">
                      {s.label}
                      <span className={`pd-stat-trend ${s.trend}`}>
                        {s.trend === "up" ? "↑" : "↓"} {s.pct}
                      </span>
                    </div>
                    <div className="pd-stat-value" style={{ color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Mid: Attendance + Performance */}
              <div className="pd-mid-grid">
                {/* Student Attendance */}
                <div className="pd-card">
                  <div className="pd-card-head">
                    <span className="pd-card-title">Student Attendance</span>
                    <div className="pd-dots"><span/><span/><span/></div>
                  </div>
                  <div className="pd-donut-wrap">
                    <div className="pd-donut-rel">
                      <Doughnut data={attendDonutData} options={attendDonutOpts} width={160} height={160} />
                      <div className="pd-donut-center">
                        <div className="pd-donut-pct">80%</div>
                      </div>
                    </div>
                    <div className="pd-legend-row">
                      <div className="pd-legend-item">
                        <div className="pd-legend-dot" style={{ background: "#C4B5FD" }} />Present
                      </div>
                      <div className="pd-legend-item">
                        <div className="pd-legend-dot" style={{ background: "#FCD34D" }} />Absent
                      </div>
                    </div>
                    <div className="pd-filter-row" style={{ marginTop: 8 }}>
                      <span className="pd-filter-pill">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        10 April 2024 <ChevronDown size={10} />
                      </span>
                      <span className="pd-filter-pill">Grade 3 <ChevronDown size={10} /></span>
                    </div>
                  </div>
                </div>

                {/* Student Performance */}
                <div className="pd-card">
                  <div className="pd-card-head">
                    <span className="pd-card-title">Student Performance</span>
                    <span className="pd-filter-pill">Weekly <ChevronDown size={10} /></span>
                  </div>
                  <div className="pd-chart-legend" style={{ marginBottom: 12 }}>
                    <span><div className="pd-chart-dot" style={{ background: "#93C5FD" }} />Class 10</span>
                    <span><div className="pd-chart-dot" style={{ background: "#C4B5FD" }} />Class 11</span>
                    <span><div className="pd-chart-dot" style={{ background: "#FCD34D" }} />Class 12</span>
                  </div>
                  <div style={{ position: "relative", height: 190 }}>
                    <Bar data={perfData} options={perfOpts} />
                  </div>
                </div>
              </div>

              {/* Bottom: Tasks + Activity */}
              <div className="pd-bottom-grid">
                {/* Tasks */}
                <div className="pd-card pd-tasks-card">
                  <div className="pd-card-head">
                    <span className="pd-card-title">Tasks</span>
                    <button className="pd-add-task-btn" onClick={addTask}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Add Task
                    </button>
                  </div>
                  <div className="pd-task-search">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                      placeholder="Search Task"
                      value={taskSearch}
                      onChange={e => setTaskSearch(e.target.value)}
                    />
                  </div>
                  <div className="pd-task-list">
                    {filteredTasks.map(task => (
                      <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                    ))}
                    {filteredTasks.length === 0 && (
                      <div style={{ textAlign: "center", color: "#98A2B3", fontSize: 13, padding: "20px 0" }}>No tasks found</div>
                    )}
                  </div>
                </div>

                {/* Teaching / Engagement Activity */}
                <div className="pd-card">
                  <div className="pd-activity-head">
                    <span className="pd-activity-title">Teaching Activity</span>
                    <span className="pd-filter-pill">Monthly <ChevronDown size={10} /></span>
                  </div>
                  <div style={{ position: "relative", height: 220 }}>
                    <Line data={activityData} options={activityOpts} />
                  </div>
                </div>
              </div>

            </div>{/* end center col */}

            {/* ── Right Panel ── */}
            <aside className="pd-right-panel">
              {/* Calendar */}
              <div className="pd-right-section">
                <div className="pd-cal-header">
                  <span className="pd-cal-title">{calendarTitle}</span>
                  <div className="pd-cal-nav">
                    <button className="pd-cal-btn" onClick={() => setCalendarMonthStart(p => new Date(p.getFullYear(), p.getMonth() - 1, 1))}>
                      <ChevronLeft size={13} />
                    </button>
                    <button className="pd-cal-btn" onClick={() => setCalendarMonthStart(p => new Date(p.getFullYear(), p.getMonth() + 1, 1))}>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
                <div className="pd-cal-weekdays">
                  {WEEK_DAYS.map(d => <div key={d} className="pd-cal-weekday">{d}</div>)}
                </div>
                <div className="pd-cal-grid">
                  {calendarGrid.map((date, idx) => (
                    <button
                      key={`${date ?? "e"}-${idx}`}
                      className={`pd-cal-date${date === null ? " empty" : ""}${isCurMonth && date === today.getDate() ? " today" : ""}`}
                      disabled={date === null}
                    >
                      {date ?? ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Agenda */}
              <div className="pd-right-section">
                <div className="pd-section-head">
                  <span className="pd-section-title">Agenda</span>
                  <div className="pd-section-dots"><span/><span/><span/></div>
                </div>
                {AGENDA.map((a, i) => (
                  <div className="pd-agenda-item" key={i}>
                    <div className="pd-agenda-item-top">
                      <span className="pd-agenda-subject">{a.subject}</span>
                      <span className="pd-agenda-time">{a.time}</span>
                    </div>
                    <div className="pd-agenda-title">{a.title}</div>
                    <div className="pd-agenda-bar" style={{ background: a.color, opacity: 0.25 }} />
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}