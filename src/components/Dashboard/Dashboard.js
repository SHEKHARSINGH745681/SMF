import React, { useState, useEffect, useRef } from "react";
import AddStudent from "../Student/AddStudent";
import StudentList from "../Student/StudentList";
import StudentDetail from "../Student/StudentDetail";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import "./Dashboard.css";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

/* ─── Icons (inline SVG components) ─── */
const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none", sw = "1.8", children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>
);

const ChevronDown = () => <Icon d="M6 9l6 6 6-6" />;
const ChevronRight = () => <Icon d="M9 18l6-6-6-6" />;
const ChevronLeft = () => <Icon d="M15 18l-6-6 6-6" />;
const ChevronUp = () => <Icon d="M18 15l-6-6-6 6" />;

const NAV_ITEMS = [
  {
    key: "dashboard", label: "Dashboard",
    icon: <Icon fill="currentColor" stroke="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="currentColor" strokeWidth="1.8" /></Icon>,
  },
  {
    key: "teachers", label: "Teachers",
    icon: <Icon><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></Icon>,
    hasArrow: true,
  },
  {
    key: "students", label: "Students",
    icon: <Icon><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>,
    submenu: [
      { key: "addStudent", label: "Add Student" },
      { key: "studentList", label: "Student List" },
      { key: "studentDetails", label: "Student Details" },
    ],
  },
  {
    key: "attendance", label: "Attendance",
    icon: <Icon><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></Icon>,
    hasArrow: true,
  },
  {
    key: "finance", label: "Finance",
    icon: <Icon><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></Icon>,
    hasArrow: true,
  },
  {
    key: "notice", label: "Notice",
    icon: <Icon><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>,
  },
  {
    key: "calendar", label: "Calendar",
    icon: <Icon><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Icon>,
  },
  {
    key: "library", label: "Library",
    icon: <Icon><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></Icon>,
  },
  {
    key: "message", label: "Message",
    icon: <Icon><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></Icon>,
  },
];

const OTHER_ITEMS = [
  { key: "profile", label: "Profile", icon: <Icon><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" /></Icon> },
  { key: "setting", label: "Setting", icon: <Icon><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" /></Icon> },
  { key: "logout", label: "Log out", icon: <Icon><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></Icon>, danger: true },
];

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEK_DATES = [19, 20, 21, 22, 23, 24, 25];
const TODAY_IDX = 3; // Wednesday = 22

const AGENDA = [
  { time: "08:00 am", grade: "All Grade", title: "Homeroom & Announcement", color: "purple" },
  { time: "10:00 am", grade: "Grade 3–5", title: "Math Review & Practice", color: "yellow" },
  { time: "10:30 am", grade: "Grade 6–8", title: "Science Experiment & Discussion", color: "blue" },
];

const MESSAGES = [
  { initials: "LR", name: "Dr. Lila Ramirez", time: "9:00 AM", text: "Please ensure the monthly attendance report is accurate before the April 30th deadline.", bg: "#EDE9FE", color: "#7C3AED", badge: null },
  { initials: "HM", name: "Ms. Heather Morris", time: "10:15 AM", text: "Don't forget the staff training on digital tools scheduled for May 5th at 3 PM in the...", bg: "#FEF9C3", color: "#A16207", badge: 4 },
  { initials: "CJ", name: "Mr. Carl Jenkins", time: "2:00 PM", text: "Budget review meeting for the next fiscal year is on Thursday morning...", bg: "#E0F2FE", color: "#0369A1", badge: null },
];

const STAT_CARDS = [
  { value: "124,684", label: "Students", trend: "up", pct: "15%", bg: "card-purple" },
  { value: "12,379", label: "Teachers", trend: "down", pct: "3%", bg: "card-yellow" },
  { value: "29,300", label: "Staffs", trend: "down", pct: "3%", bg: "card-purple" },
  { value: "95,800", label: "Awards", trend: "up", pct: "5%", bg: "card-yellow" },
];

/* ─── Chart data ─── */
const donutData = {
  datasets: [{ data: [47, 53], backgroundColor: ["#93C5FD", "#FCD34D"], borderWidth: 0, hoverOffset: 4 }],
};
const donutOptions = {
  responsive: false,
  cutout: "72%",
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
};

const attendData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    { label: "Present", data: [68, 72, 95, 60, 70], backgroundColor: "#FCD34D", borderRadius: 4, barThickness: 14 },
    { label: "Absent", data: [55, 60, 65, 55, 60], backgroundColor: "#93C5FD", borderRadius: 4, barThickness: 14 },
  ],
};
const attendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 }, color: "#98A2B3" } },
    y: { grid: { color: "#F2F4F7" }, border: { display: false }, ticks: { font: { size: 10 }, color: "#98A2B3", stepSize: 25 }, min: 0, max: 100 },
  },
};

const earningsData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  datasets: [
    { label: "Income", data: [600, 750, 800, 700, 900, 850, 750, 837, 900, 800], borderColor: "#93C5FD", backgroundColor: "rgba(147,197,253,0.12)", tension: 0.4, borderWidth: 2.5, pointRadius: 0, fill: true },
    { label: "Expense", data: [500, 600, 650, 620, 700, 680, 620, 700, 750, 700], borderColor: "#C4B5FD", backgroundColor: "rgba(196,181,253,0.12)", tension: 0.4, borderWidth: 2.5, pointRadius: 0, fill: true },
  ],
};
const earningsOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false, callbacks: { label: (c) => `${c.dataset.label}: $${c.raw}K` } } },
  scales: {
    x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 10 }, color: "#98A2B3" } },
    y: { display: false },
  },
};

/* ─── Sub-components ─── */
function StatCard({ value, label, trend, pct, bg }) {
  return (
    <div className={`sh-stat-card ${bg}`}>
      <div className="sh-stat-top">
        <span className={`sh-stat-badge ${trend}`}>
          {trend === "up" ? <ChevronUp /> : <ChevronDown />}
          {pct}
        </span>
        <span className="sh-stat-dots">
          <span /><span /><span />
        </span>
      </div>
      <div className="sh-stat-val">{value}</div>
      <div className="sh-stat-lbl">{label}</div>
    </div>
  );
}

function AgendaItem({ time, grade, title, color }) {
  return (
    <div className="sh-agenda-item">
      <div className="sh-agenda-time">{time}</div>
      <div className={`sh-agenda-content ${color}`}>
        <div className="sh-agenda-grade">{grade}</div>
        <div className="sh-agenda-name">{title}</div>
      </div>
    </div>
  );
}

function MessageItem({ initials, name, time, text, bg, color, badge }) {
  return (
    <div className="sh-msg">
      <div className="sh-msg-avatar" style={{ background: bg, color }}>{initials}</div>
      <div className="sh-msg-body">
        <div className="sh-msg-top">
          <span className="sh-msg-name">{name}</span>
          <span className="sh-msg-time">{time}</span>
        </div>
        <div className="sh-msg-text">{text}</div>
      </div>
      {badge && <div className="sh-msg-badge">{badge}</div>}
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function Dashboard({ username = "Linda Adora" }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [openMenus, setOpenMenus] = useState({ students: false });
  const [collapsed, setCollapsed] = useState(false);

  const initials = username.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const toggleMenu = (key) => setOpenMenus((p) => ({ ...p, [key]: !p[key] }));

  const navigate = (key) => {
    setActivePage(key);
  };

  return (
    <div className="sh-layout">
      {/* ── Sidebar ── */}
      <aside className={`sh-sidebar${collapsed ? " collapsed" : ""}`}>
        <div className="sh-logo">
          <div className="sh-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          {!collapsed && <span className="sh-logo-text">SchoolHub</span>}
          <button className="sh-collapse-btn" onClick={() => setCollapsed((v) => !v)}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        <nav className="sh-nav">
          {!collapsed && <div className="sh-nav-label">Menu</div>}
          {NAV_ITEMS.map((item) => (
            <div key={item.key} className="sh-nav-group">
              <button
                className={`sh-nav-item${activePage === item.key || activePage === item.key ? " active" : ""}${item.danger ? " danger" : ""}`}
                onClick={() => {
                  navigate(item.key);
                  if (item.submenu) toggleMenu(item.key);
                }}
                title={collapsed ? item.label : ""}
              >
                <span className="sh-nav-icon">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="sh-nav-label-text">{item.label}</span>
                    {item.submenu && (
                      <span className="sh-arrow">{openMenus[item.key] ? <ChevronDown /> : <ChevronRight />}</span>
                    )}
                    {item.hasArrow && <span className="sh-arrow"><ChevronRight /></span>}
                  </>
                )}
              </button>
              {item.submenu && openMenus[item.key] && !collapsed && (
                <ul className="sh-submenu">
                  {item.submenu.map((sub) => (
                    <li key={sub.key}>
                      <button
                        className={`sh-submenu-btn${activePage === sub.key ? " active" : ""}`}
                        onClick={() => navigate(sub.key)}
                      >
                        <span className="sh-sub-dot" />
                        {sub.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="sh-nav-spacer" />
          {!collapsed && <div className="sh-nav-label" style={{ marginTop: 8 }}>Other</div>}
          {OTHER_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`sh-nav-item${item.danger ? " danger" : ""}`}
              title={collapsed ? item.label : ""}
            >
              <span className="sh-nav-icon">{item.icon}</span>
              {!collapsed && <span className="sh-nav-label-text">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="sh-main">
        {/* Topbar */}
        <header className="sh-topbar">
          <div className="sh-search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input placeholder="Search..." />
          </div>
          <div className="sh-topbar-right">
            <button className="sh-icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </button>
            <button className="sh-icon-btn sh-notif-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="sh-notif-dot" />
            </button>
            <div className="sh-topbar-user">
              <div className="sh-user-avatar">{initials}</div>
              <div>
                <div className="sh-user-name">{username}</div>
                <div className="sh-user-role">Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="sh-content">
          {activePage === "addStudent" ? (
            <AddStudent />
          ) : activePage === "studentList" ? (
            <StudentList />
          ) : activePage === "studentDetails" ? (
            <StudentDetail />
          ) : (
            <div className="sh-dashboard-body">
              {/* ── Center Column ── */}
              <div className="sh-center-col">
                {/* Stat Cards */}
                <div className="sh-stats-grid">
                  {STAT_CARDS.map((s, i) => <StatCard key={i} {...s} />)}
                </div>

                {/* Students donut + Attendance */}
                <div className="sh-mid-grid">
                  {/* Donut */}
                  <div className="sh-card">
                    <div className="sh-card-head">
                      <span className="sh-card-title">Students</span>
                      <span className="sh-dots"><span /><span /><span /></span>
                    </div>
                    <div className="sh-donut-wrap">
                      <div className="sh-donut-rel">
                        <Doughnut data={donutData} options={donutOptions} width={160} height={160} />
                        <div className="sh-donut-center">
                          <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
                            <circle cx="16" cy="20" r="7" fill="#93C5FD" />
                            <circle cx="32" cy="20" r="7" fill="#FCD34D" />
                            <path d="M4 40c0-6.6 5.4-12 12-12h4M28 28h4c6.6 0 12 5.4 12 12" stroke="#667085" strokeWidth="1.5" />
                          </svg>
                        </div>
                      </div>
                      <div className="sh-gender-row">
                        <div className="sh-gender">
                          <div className="sh-gender-val">45,414</div>
                          <div className="sh-gender-lbl"><span className="sh-gender-dot" style={{ background: "#93C5FD" }} />Boys (47%)</div>
                        </div>
                        <div className="sh-gender">
                          <div className="sh-gender-val">40,270</div>
                          <div className="sh-gender-lbl"><span className="sh-gender-dot" style={{ background: "#FCD34D" }} />Girls (53%)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attendance */}
                  <div className="sh-card">
                    <div className="sh-card-head">
                      <span className="sh-card-title">Attendance</span>
                      <div className="sh-filter-row">
                        <span className="sh-pill">Weekly <ChevronDown /></span>
                        <span className="sh-pill">Grade 3 <ChevronDown /></span>
                      </div>
                    </div>
                    <div className="sh-chart-legend" style={{ marginBottom: 10 }}>
                      <span><span className="sh-legend-dot" style={{ background: "#FCD34D" }} />Total Present</span>
                      <span><span className="sh-legend-dot" style={{ background: "#93C5FD" }} />Total Absent</span>
                    </div>
                    <div style={{ position: "relative", height: 180 }}>
                      <Bar data={attendData} options={attendOptions} />
                    </div>
                  </div>
                </div>

                {/* Earnings + Events */}
                <div className="sh-bottom-grid">
                  <div className="sh-card">
                    <div className="sh-card-head">
                      <span className="sh-card-title">Earnings</span>
                      <span className="sh-dots"><span /><span /><span /></span>
                    </div>
                    <div className="sh-chart-legend" style={{ marginBottom: 10 }}>
                      <span><span className="sh-legend-dot" style={{ background: "#93C5FD" }} />Income</span>
                      <span><span className="sh-legend-dot" style={{ background: "#C4B5FD" }} />Expense</span>
                    </div>
                    <div style={{ position: "relative", height: 140 }}>
                      <Line data={earningsData} options={earningsOptions} />
                    </div>
                  </div>

                  <div className="sh-card sh-events-card">
                    <div className="sh-card-head">
                      <span className="sh-card-title">Events</span>
                      <span className="sh-dots"><span /><span /><span /></span>
                    </div>
                    <div className="sh-events-body">
                      <div className="sh-events-num">24,680</div>
                      <div className="sh-events-lbl">Olympic Students</div>
                      <div className="sh-events-badge">
                        <ChevronUp /> 15%
                      </div>
                      <div className="sh-events-tags">
                        <span className="sh-events-tag">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          Sep 14, 2030
                        </span>
                        <span className="sh-events-tag yellow">$837,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Right Panel ── */}
              <aside className="sh-right-panel">
                {/* Week Calendar */}
                <div className="sh-right-section">
                  <div className="sh-cal-header">
                    <span className="sh-cal-title">September 2030</span>
                    <div className="sh-cal-nav">
                      <button className="sh-cal-btn"><ChevronLeft /></button>
                      <button className="sh-cal-btn"><ChevronRight /></button>
                    </div>
                  </div>
                  <div className="sh-week-row">
                    {WEEK_DAYS.map((d, i) => (
                      <div key={d} className="sh-week-day">
                        <div className="sh-day-name">{d}</div>
                        <div className={`sh-day-num${i === TODAY_IDX ? " today" : ""}`}>{WEEK_DATES[i]}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agenda */}
                <div className="sh-right-section">
                  <div className="sh-section-head">
                    <span className="sh-section-title">Agenda</span>
                    <span className="sh-dots sm"><span /><span /><span /></span>
                  </div>
                  {AGENDA.map((a, i) => <AgendaItem key={i} {...a} />)}
                </div>

                {/* Messages */}
                <div className="sh-right-section">
                  <div className="sh-section-head">
                    <span className="sh-section-title">Messages</span>
                    <span className="sh-view-all">View All</span>
                  </div>
                  {MESSAGES.map((m, i) => <MessageItem key={i} {...m} />)}
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}