import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./StudentDashboard.css";

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Filler, Tooltip, Legend
);

/* ─── Inline SVG Icon helper ─── */
const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", sw = "1.8", children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>
);
const ChevronLeft  = () => <Icon d="M15 18l-6-6 6-6" />;
const ChevronRight = () => <Icon d="M9 18l6-6-6-6" />;
const ChevronDown  = () => <Icon d="M6 9l6 6 6-6" />;

/* ─── Nav items ─── */
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard",
    icon: <Icon fill="currentColor" stroke="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="currentColor" strokeWidth="1.8"/></Icon> },
  { key: "teachers",  label: "Teachers",
    icon: <Icon><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></Icon>, hasArrow: true },
  { key: "students",  label: "Students",
    icon: <Icon><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>, hasArrow: true },
  { key: "attendance", label: "Attendance",
    icon: <Icon><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></Icon>, hasArrow: true },
  { key: "finance",   label: "Finance",
    icon: <Icon><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></Icon>, hasArrow: true },
  { key: "notice",    label: "Notice",
    icon: <Icon><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Icon> },
  { key: "calendar",  label: "Calendar",
    icon: <Icon><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Icon> },
  { key: "library",   label: "Library",
    icon: <Icon><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></Icon> },
  { key: "message",   label: "Message",
    icon: <Icon><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></Icon> },
];
const OTHER_ITEMS = [
  { key: "profile",  label: "Profile",  icon: <Icon><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 10-16 0"/></Icon> },
  { key: "setting",  label: "Setting",  icon: <Icon><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></Icon> },
  { key: "logout",   label: "Log out",  icon: <Icon><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>, danger: true },
];

const WEEK_DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

/* ─── Static data ─── */
const WELCOME_STATS = [
  { icon: "📊", label: "Attendance",      value: "57%",  bg: "#EBF5FF", iconBg: "#DBEAFE" },
  { icon: "✅", label: "Task Completed",  value: "258+", bg: "#ECFDF5", iconBg: "#D1FAE5" },
  { icon: "⏳", label: "Task in Progress",value: "64%",  bg: "#FFF7ED", iconBg: "#FEE2B3" },
  { icon: "🏆", label: "Reward Points",   value: "245",  bg: "#F5F3FF", iconBg: "#EDE9FE" },
];

const getAttendanceCardBackground = (value) => {
  const numericValue = Number.parseFloat(value);
  return Number.isFinite(numericValue) && numericValue < 60 ? "#FEE2E2" : "#EBF5FF";
};

const getAttendanceIconBackground = (value) => {
  const numericValue = Number.parseFloat(value);
  return Number.isFinite(numericValue) && numericValue < 60 ? "#FECACA" : "#DBEAFE";
};

const GRADE_SUBJECTS = [
  { subject: "Biology",   score: 82, color: "#A78BFA" },
  { subject: "Chemistry", score: 68, color: "#67E8F9" },
  { subject: "Geography", score: 74, color: "#FCA5A5" },
  { subject: "History",   score: 91, color: "#6EE7B7" },
  { subject: "Literature",score: 78, color: "#93C5FD" },
  { subject: "Art",       score: 88, color: "#FDE68A" },
];

const ACTIVITY_TODAY = [
  { icon: "🔔", bg: "#EBF5FF", text: <><strong>Reminder:</strong> Attending Physics Group Meeting.</>, time: "1:00 PM" },
  { icon: "🎨", bg: "#FFF7ED", text: <><strong>Reminder:</strong> Art Supplies Collection.</>,         time: "10:30 AM" },
  { icon: "🏅", bg: "#ECFDF5", text: <>You got <strong>Award for 1st place student</strong></>,        time: "10:30 AM" },
];
const ACTIVITY_YESTERDAY = [
  { icon: "🧬", bg: "#F5F3FF", text: <>Biology with Ms. Carter <strong>Quiz Scheduled</strong></>,   time: "4:00 PM" },
  { icon: "📝", bg: "#FEF3C7", text: <>Received <strong>Feedback on English Essay.</strong></>,       time: "9:15 AM" },
  { icon: "📐", bg: "#EBF5FF", text: <><strong>Submitted</strong> Mathematics Assignment.</>,          time: "2:45 PM" },
  { icon: "🤖", bg: "#ECFDF5", text: <>Submit The Regional <strong>Robotics Champion.</strong></>,    time: "2:45 PM" },
];

const AGENDA = [
  { date: "Monday · Mar 24", title: "Homeroom & Announcement", subject: "Mathematics", subjectColor: "#A78BFA", dot: "#A78BFA" },
  { date: "Wednesday · Apr 26", title: "Science Fair Preparation", subject: "Science",     subjectColor: "#22C55E",  dot: "#22C55E" },
  { date: "Friday · Apr 28",   title: "History Documentary Viewing", subject: "History", subjectColor: "#F59E0B",  dot: "#F59E0B" },
  { date: "Monday · Apr 31",   title: "Art Champion Announcement",   subject: "Art",     subjectColor: "#F97316",  dot: "#F97316" },
];

const MESSAGES = [
  { initials: "MC", name: "Ms. Carter",   time: "4:15 PM",  text: "Don't forget, tomorrow's lab report on titration is due by 9 AM.",       bg: "#EDE9FE", color: "#7C3AED" },
  { initials: "JK", name: "Jake",          time: "12:30 PM", text: "Hey, are we still meeting up after school to study for the math test?",  bg: "#DBEAFE", color: "#1D4ED8", badge: 3 },
  { initials: "CS", name: "Coach Simmons", time: "2:00 PM",  text: "Practice is moved to 5 PM today because of the assembly.",               bg: "#DCFCE7", color: "#16A34A" },
];

/* ─── Score Activity chart ─── */
const scoreData = {
  labels: ["Apr 10","Apr 11","Apr 12","Apr 13","Apr 14","Apr 15","Apr 16"],
  datasets: [{
    label: "Score",
    data: [62, 55, 78, 65, 90, 70, 85],
    borderColor: "#FCD34D",
    backgroundColor: "rgba(252,211,77,0.18)",
    tension: 0.45,
    borderWidth: 2.5,
    pointRadius: (ctx) => {
      const idx = ctx.dataIndex;
      return idx === 4 ? 6 : 0;
    },
    pointBackgroundColor: "#FCD34D",
    fill: true,
  }],
};
const scoreOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 1400, easing: "easeOutCubic" },
  animations: {
    x: {
      from: 0,
      delay: (ctx) => ctx.dataIndex * 60,
    },
    y: {
      from: 0,
      delay: (ctx) => ctx.dataIndex * 60,
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: "index", intersect: false,
      callbacks: { label: (c) => `Score: ${c.raw}` },
    },
  },
  scales: {
    x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 }, color: "#98A2B3" } },
    y: { grid: { color: "#F2F4F7" }, border: { display: false }, ticks: { font: { size: 10 }, color: "#98A2B3", stepSize: 25 }, min: 0, max: 100 },
  },
};

/* ─── GPA Gauge (pure SVG semicircle) ─── */
function GaugeChart({ value = 3.4, max = 4.0 }) {
  const pct    = value / max;
  const R      = 80;
  const cx     = 100;
  const cy     = 100;
  const circ   = Math.PI * R;

  /* track segments: purple then yellow */
  const purplePct  = Math.min(pct, 0.6);
  const yellowPct  = Math.max(0, pct - 0.6);
  const purpleDash = `${circ * purplePct} ${circ - circ * purplePct}`;
  const yellowDash = `${circ * yellowPct} ${circ - circ * yellowPct}`;

  return (
    <div className="sd-gauge-wrap">
      <div className="sd-gauge-canvas-wrap">
        <svg className="sd-gauge-svg" viewBox="0 0 200 200">
          {/* track */}
          <circle cx={cx} cy={cy} r={R}
            fill="none" stroke="#F2F4F7" strokeWidth="14"
            strokeDasharray={`${circ} ${circ}`}
            strokeDashoffset={circ * 0.25}
            strokeLinecap="round"
            transform="rotate(-180 100 100)"
          />
          {/* purple segment */}
          <circle cx={cx} cy={cy} r={R}
            fill="none" stroke="#C4B5FD" strokeWidth="14"
            strokeDasharray={purpleDash}
            strokeDashoffset={circ * 0.25}
            strokeLinecap="round"
            transform="rotate(-180 100 100)"
          />
          {/* yellow segment */}
          {yellowPct > 0 && (
            <circle cx={cx} cy={cy} r={R}
              fill="none" stroke="#FCD34D" strokeWidth="14"
              strokeDasharray={yellowDash}
              strokeDashoffset={circ * 0.25 - circ * purplePct}
              strokeLinecap="round"
              transform="rotate(-180 100 100)"
            />
          )}
        </svg>
        <div className="sd-gauge-label">
          <div className="sd-gauge-val">{value}</div>
          <div className="sd-gauge-sub">of {max.toFixed(1)} max GPA</div>
        </div>
      </div>
      <div className="sd-gauge-footer">1st Semester – 6st Semester</div>
    </div>
  );
}

/* ─── Grade bar list ─── */
function GradeBySubject() {
  return (
    <div className="sd-grade-list">
      {GRADE_SUBJECTS.map((s) => (
        <div className="sd-grade-item" key={s.subject}>
          <div className="sd-grade-item-top">
            <span className="sd-grade-subject">{s.subject}</span>
            <span className="sd-grade-score">{s.score}</span>
          </div>
          <div className="sd-grade-bar-bg">
            <div className="sd-grade-bar-fill" style={{ width: `${s.score}%`, background: s.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Activity feed ─── */
function ActivityFeed() {
  const [showAll, setShowAll] = useState(false);
  const yesterday = showAll ? ACTIVITY_YESTERDAY : ACTIVITY_YESTERDAY.slice(0, 2);
  return (
    <div className="sd-activity-section">
      <div>
        <div className="sd-activity-group-label">Today</div>
        {ACTIVITY_TODAY.map((a, i) => (
          <div className="sd-activity-item" key={i} style={{ marginBottom: 12 }}>
            <div className="sd-activity-icon" style={{ background: a.bg }}>{a.icon}</div>
            <div className="sd-activity-body">
              <div className="sd-activity-text">{a.text}</div>
              <div className="sd-activity-time">{a.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="sd-activity-group-label">Yesterday</div>
        {yesterday.map((a, i) => (
          <div className="sd-activity-item" key={i} style={{ marginBottom: 12 }}>
            <div className="sd-activity-icon" style={{ background: a.bg }}>{a.icon}</div>
            <div className="sd-activity-body">
              <div className="sd-activity-text">{a.text}</div>
              <div className="sd-activity-time">{a.time}</div>
            </div>
          </div>
        ))}
        <button className="sd-view-all-btn" onClick={() => setShowAll(v => !v)}>
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>
    </div>
  );
}

/* ─── Message item ─── */
function MsgItem({ initials, name, time, text, bg, color, badge }) {
  return (
    <div className="sd-msg">
      <div className="sd-msg-avatar" style={{ background: bg, color }}>{initials}</div>
      <div className="sd-msg-body">
        <div className="sd-msg-top">
          <span className="sd-msg-name">{name}</span>
          <span className="sd-msg-time">{time}</span>
        </div>
        <div className="sd-msg-text">{text}</div>
      </div>
      {badge && <div className="sd-msg-badge">{badge}</div>}
    </div>
  );
}

/* ─── Main Component ─── */
export default function StudentDashboard({ username = "Mia Williams" }) {
  const today = new Date();
  const [activePage,       setActivePage]       = useState("dashboard");
  const [collapsed,        setCollapsed]         = useState(false);
  const [calendarMonthStart, setCalendarMonthStart] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  /* Calendar helpers */
  const calendarTitle    = calendarMonthStart.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDayOfMonth  = calendarMonthStart.getDay();
  const daysInMonth      = new Date(calendarMonthStart.getFullYear(), calendarMonthStart.getMonth() + 1, 0).getDate();
  const calendarDates    = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarCells    = [...Array.from({ length: firstDayOfMonth }, () => null), ...calendarDates];
  const trailing         = (7 - (calendarCells.length % 7)) % 7;
  const calendarGrid     = [...calendarCells, ...Array.from({ length: trailing }, () => null)];
  const isCurrentMonth   =
    calendarMonthStart.getFullYear() === today.getFullYear() &&
    calendarMonthStart.getMonth() === today.getMonth();

  const initials = username.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="sd-layout">
      {/* ── Sidebar ── */}
      <aside className={`sd-sidebar${collapsed ? " collapsed" : ""}`}>
        {/* Logo */}
        <div className="sd-logo">
          <div className="sd-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          {!collapsed && <span className="sd-logo-text">SchoolHub</span>}
          <button className="sd-collapse-btn" onClick={() => setCollapsed(v => !v)}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* Nav */}
        <nav className="sd-nav">
          {!collapsed && <div className="sd-nav-section-label">Menu</div>}
          {NAV_ITEMS.map(item => (
            <div className="sd-nav-group" key={item.key}>
              <button
                className={`sd-nav-item${activePage === item.key ? " active" : ""}`}
                onClick={() => setActivePage(item.key)}
                title={collapsed ? item.label : ""}
              >
                <span className="sd-nav-icon">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="sd-nav-label-text">{item.label}</span>
                    {item.hasArrow && <span className="sd-nav-arrow"><ChevronRight /></span>}
                  </>
                )}
              </button>
            </div>
          ))}
          <div className="sd-nav-spacer" />
          {!collapsed && <div className="sd-nav-section-label">Other</div>}
          {OTHER_ITEMS.map(item => (
            <button
              key={item.key}
              className={`sd-nav-item${item.danger ? " danger" : ""}`}
              title={collapsed ? item.label : ""}
            >
              <span className="sd-nav-icon">{item.icon}</span>
              {!collapsed && <span className="sd-nav-label-text">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="sd-main">
        {/* Topbar */}
        <header className="sd-topbar">
          <div className="sd-search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search..." />
          </div>
          <div className="sd-topbar-right">
            <button className="sd-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </button>
            <button className="sd-icon-btn sd-notif-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <span className="sd-notif-dot" />
            </button>
            <div className="sd-topbar-user">
              <div className="sd-user-avatar">{initials}</div>
              <div>
                <div className="sd-user-name">{username}</div>
                <div className="sd-user-role">Student</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="sd-content">
          <div className="sd-dashboard-body">
            {/* ── Center Column ── */}
            <div className="sd-center-col">

              {/* Welcome Banner */}
              <div className="sd-welcome-banner">
                {/* Avatar */}
                <div className="sd-welcome-avatar-wrap">
                  <div className="sd-welcome-avatar">
                    <span className="sd-avatar-initials">{initials}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="sd-welcome-info">
                  <div className="sd-welcome-hello">Welcome, {username} 👋</div>
                  <div className="sd-welcome-desc">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,<br/>
                    sed do eiusmod tempor incididunt
                  </div>
                  <div className="sd-welcome-meta">
                    <div className="sd-welcome-meta-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      Grade 12
                    </div>
                    <div className="sd-welcome-meta-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      November, 25 2009
                    </div>
                    <div className="sd-welcome-meta-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      miawilliams@mail.co
                    </div>
                    <div className="sd-welcome-meta-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.28-1.28a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                      +28 1234 5678
                    </div>
                  </div>
                </div>

                {/* Stat cards */}
                <div className="sd-welcome-stat-cards-grid">
                  {WELCOME_STATS.map((s) => (
                    <div
                      className="sd-welcome-stat-card"
                      key={s.label}
                      style={{
                        background: s.label === "Attendance" ? getAttendanceCardBackground(s.value) : s.bg,
                      }}
                    >
                      <div className="sd-welcome-stat-row">
                        <div
                          className="sd-welcome-stat-icon"
                          style={{
                            background: s.label === "Attendance" ? getAttendanceIconBackground(s.value) : s.iconBg,
                          }}
                        >
                          {s.icon}
                        </div>
                        <div className="sd-welcome-stat-val">{s.value}</div>
                      </div>
                      <div className="sd-welcome-stat-lbl">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mid: Performance + Score Activity */}
              <div className="sd-mid-grid">
                {/* Performance */}
                <div className="sd-card">
                  <div className="sd-card-head">
                    <span className="sd-card-title">Performance</span>
                    <div className="sd-dots"><span/><span/><span/></div>
                  </div>
                  <GaugeChart value={3.4} max={4.0} />
                </div>

                {/* Score Activity */}
                <div className="sd-card">
                  <div className="sd-card-head">
                    <span className="sd-card-title">Score Activity</span>
                    <span className="sd-filter-pill">Weekly <ChevronDown /></span>
                  </div>
                  <div style={{ position: "relative", height: 180 }}>
                    <Line data={scoreData} options={scoreOptions} />
                  </div>
                </div>
              </div>

              {/* Bottom: Recent Activity + Grade by Subject */}
              <div className="sd-bottom-grid">
                {/* Recent Activity */}
                <div className="sd-card">
                  <div className="sd-card-head">
                    <span className="sd-card-title">Recent Activity</span>
                    <button className="sd-view-all-btn">View All</button>
                  </div>
                  <ActivityFeed />
                </div>

                {/* Grade by Subject */}
                <div className="sd-card">
                  <div className="sd-card-head">
                    <span className="sd-card-title">Grade by Subject</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span className="sd-filter-pill">Weekly <ChevronDown /></span>
                      <span className="sd-filter-pill">Grade 3 <ChevronDown /></span>
                    </div>
                  </div>
                  <GradeBySubject />
                </div>
              </div>
            </div>

            {/* ── Right Panel ── */}
            <aside className="sd-right-panel">
              {/* Calendar */}
              <div className="sd-right-section">
                <div className="sd-cal-header">
                  <span className="sd-cal-title">{calendarTitle}</span>
                  <div className="sd-cal-nav">
                    <button className="sd-cal-btn" onClick={() => setCalendarMonthStart(p => new Date(p.getFullYear(), p.getMonth() - 1, 1))}>
                      <ChevronLeft />
                    </button>
                    <button className="sd-cal-btn" onClick={() => setCalendarMonthStart(p => new Date(p.getFullYear(), p.getMonth() + 1, 1))}>
                      <ChevronRight />
                    </button>
                  </div>
                </div>
                <div className="sd-cal-weekdays">
                  {WEEK_DAYS.map(d => <div key={d} className="sd-cal-weekday">{d}</div>)}
                </div>
                <div className="sd-cal-grid">
                  {calendarGrid.map((date, idx) => (
                    <button
                      key={`${date ?? "e"}-${idx}`}
                      className={`sd-cal-date${date === null ? " empty" : ""}${isCurrentMonth && date === today.getDate() ? " today" : ""}`}
                      disabled={date === null}
                    >
                      {date ?? ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Agenda */}
              <div className="sd-right-section">
                <div className="sd-section-head">
                  <span className="sd-section-title">Agenda</span>
                  <span className="sd-view-all">View All</span>
                </div>
                {AGENDA.map((a, i) => (
                  <div className="sd-agenda-item" key={i}>
                    <div className="sd-agenda-dot" style={{ background: a.dot }} />
                    <div className="sd-agenda-content">
                      <div className="sd-agenda-date">{a.date}</div>
                      <div className="sd-agenda-title">{a.title}</div>
                      <div className="sd-agenda-subject" style={{ background: a.subjectColor }}>{a.subject}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Messages */}
              <div className="sd-right-section">
                <div className="sd-section-head">
                  <span className="sd-section-title">Messages</span>
                  <span className="sd-view-all">View All</span>
                </div>
                {MESSAGES.map((m, i) => <MsgItem key={i} {...m} />)}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}