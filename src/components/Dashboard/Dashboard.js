import React, { useState } from "react";
import AddStudent from "../Student/AddStudent";
import StudentList from "../Student/StudentList";
import StudentDetail from "../Student/StudentDetail";
import {
  FaHome, FaUsers, FaChalkboardTeacher, FaUserFriends,
  FaBook, FaClipboardList, FaMoneyBillWave, FaCalendarAlt,
  FaCog, FaBell, FaSun, FaFlag, FaChevronDown, FaChevronRight,
  FaChevronLeft, FaAngleRight
} from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./Dashboard.css";

const revenueData = [
  { month: "Jan", total: 25000, collected: 15000 },
  { month: "Feb", total: 35000, collected: 16000 },
  { month: "Mar", total: 50000, collected: 24000 },
  { month: "Apr", total: 60000, collected: 30000 },
  { month: "May", total: 50000, collected: 20000 },
  { month: "Jun", total: 26000, collected: 15000 },
  { month: "Jul", total: 40000, collected: 20000 },
  { month: "Aug", total: 40000, collected: 20000 },
  { month: "Sep", total: 25000, collected: 10000 },
  { month: "Oct", total: 50000, collected: 25000 },
  { month: "Nov", total: 10000, collected: 6000 },
  { month: "Dec", total: 40000, collected: 40000 },
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function Dashboard({ username = "Jone Copper" }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [openMenus, setOpenMenus] = useState({ dashboard: true });
  const [studentSubMenu, setStudentSubMenu] = useState(null);
  const [calMonth, setCalMonth] = useState(2); // March
  const [calYear, setCalYear] = useState(2026);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const today = new Date();
  const todayDate = today.getFullYear() === calYear && today.getMonth() === calMonth ? today.getDate() : null;

  const calDays = getCalendarDays(calYear, calMonth);

  const toggleMenu = (key) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const stats = [
    {
      icon: "👨‍🎓",
      label: "Total Student",
      value: "20,000",
      change: "+5 This Month",
      percent: "10%",
      bg: "card-orange",
      iconBg: "#f97316",
    },
    {
      icon: "👩‍🎓",
      label: "Total Student",
      value: "20,000",
      change: "+5 This Month",
      percent: "10%",
      bg: "card-blue",
      iconBg: "#6366f1",
    },
    {
      icon: "👥",
      label: "Total Student",
      value: "20,000",
      change: "+5 This Month",
      percent: "10%",
      bg: "card-purple",
      iconBg: "#a855f7",
    },
    {
      icon: "📚",
      label: "Total Student",
      value: "20,000",
      change: "+5 This Month",
      percent: "10%",
      bg: "card-teal",
      iconBg: "#14b8a6",
    },
    {
      icon: "💰",
      label: "Total Student",
      value: "20,000",
      change: "+5 This Month",
      percent: "10%",
      bg: "card-green",
      iconBg: "#22c55e",
    },
    {
      icon: "📋",
      label: "Total Student",
      value: "20,000",
      change: "+5 This Month",
      percent: "10%",
      bg: "card-cyan",
      iconBg: "#06b6d4",
    },
  ];

  const attendance = [
    { label: "Present", value: 87, color: "#14b8a6" },
    { label: "Absent:", value: 40, color: "#f97316" },
    { label: "Late", value: 20, color: "#a855f7" },
    { label: "Half day", value: 20, color: "#22c55e" },
  ];

  
  const navItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <FaHome />,
      submenu: [
        { key: "school", label: "School" },
        { key: "student", label: "Student" },
        { key: "teacher", label: "Teacher" },
        { key: "parent", label: "Parent" },
        { key: "lms", label: "LMS" },
      ],
    },
    {
      key: "students",
      label: "Students",
      icon: <FaUsers />,

      submenu: [
        { key: "addStudent", label: "AddStudent" },
        { key: "editStudent", label: "EditStudent" },
        { key: "studentList", label: "StudentList" },
        { key: "studentDetails", label: "StudentDetails" },
      ],
    },
    { key: "teachers", label: "Teachers", icon: <FaChalkboardTeacher />, hasArrow: true },
    { key: "guardian", label: "Guardian", icon: <FaUserFriends />, hasArrow: true },
    { key: "classes", label: "Classes", icon: <FaClipboardList />, hasArrow: true },
    { key: "examinations", label: "Examinations", icon: <FaClipboardList />, hasArrow: true },
    { key: "fees", label: "Fees Collection", icon: <FaMoneyBillWave />, hasArrow: true },
    { key: "attendance", label: "Attendance", icon: <FaCalendarAlt />, hasArrow: true },
    { key: "leaves", label: "Leaves", icon: <FaCalendarAlt />, hasArrow: true },
    { key: "certificate", label: "Certificate", icon: <FaBook /> },
  ];

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  return (
    <div className="edu-layout">
      {/* Sidebar */}
      <aside className={`edu-sidebar${sidebarCollapsed ? " collapsed" : ""}`}>
        <div className="edu-sidebar-logo">
          {!sidebarCollapsed && <span className="edu-logo-text">EduDash</span>}
          <button className="edu-collapse-btn" onClick={() => setSidebarCollapsed(v => !v)}>
            {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>



        <nav className="edu-sidebar-nav">
          {navItems.map(item => (
            <div key={item.key} className="edu-nav-group">
              <button
                className={`edu-nav-item${activePage === item.key ? " active" : ""}`}
                onClick={() => {
                  setActivePage(item.key);
                  if (item.submenu) toggleMenu(item.key);
                }}
              >
                <span className="edu-nav-icon">{item.icon}</span>
                {!sidebarCollapsed && (
                  <>
                    <span className="edu-nav-label">{item.label}</span>
                    {item.submenu && (
                      <FaChevronDown className={`edu-nav-chevron${openMenus[item.key] ? " open" : ""}`} />
                    )}
                    {item.hasArrow && <FaChevronRight className="edu-nav-chevron" />}
                  </>
                )}
              </button>

              {item.submenu && openMenus[item.key] && !sidebarCollapsed && (
                <ul className="edu-submenu">
                  {item.submenu.map(sub => (
                    <li key={sub.key} className="edu-submenu-item">
                      <span className="edu-submenu-dot"></span>
                      <button
                        className={`edu-submenu-btn${activePage === sub.key ? " active" : ""}`}
                        onClick={() => setActivePage(sub.key)}
                      >
                        {sub.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>

        <div className="edu-sidebar-footer">
          <button className="edu-settings-btn">
            <FaCog />
            {!sidebarCollapsed && <span>Settings</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="edu-main">
        {/* Topbar */}
        <header className="edu-topbar">
          <div className="edu-search-wrap">
            <span className="edu-search-icon">🔍</span>
            <input className="edu-search-input" type="text" placeholder="Search..." />
          </div>
          <div className="edu-topbar-actions">
            <button className="edu-topbar-btn"><FaSun /></button>
            <button className="edu-topbar-btn edu-flag-btn">🇺🇸</button>
            <button className="edu-topbar-btn edu-bell-btn">
              <FaBell />
              <span className="edu-bell-dot"></span>
            </button>
            <div className="edu-topbar-user">
              <span className="edu-topbar-username">{username}</span>
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="edu-topbar-avatar" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="edu-content">
          {activePage === "addStudent" ? (
            <AddStudent />
          ) : activePage === "studentList" ? (
            <StudentList />
          ) : activePage === "studentDetails" ? (
            <StudentDetail />
          ) : (
            <>
              {/* Stats grid + Attendance */}
              <div className="edu-top-section">
                <div className="edu-stats-grid">
                  {stats.map((s, i) => (
                    <div key={i} className={`edu-stat-card ${s.bg}`}>
                      <div className="edu-stat-icon-wrap" style={{ background: s.iconBg }}>
                        <span className="edu-stat-icon">{s.icon}</span>
                      </div>
                      <div className="edu-stat-info">
                        <div className="edu-stat-label">{s.label}</div>
                        <div className="edu-stat-value">{s.value}</div>
                        <div className="edu-stat-change">
                          <span className="edu-stat-percent">▲ {s.percent}</span>
                          <span className="edu-stat-month">{s.change}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Attendance */}
                <div className="edu-attendance-box">
                  <h3 className="edu-box-title">Student Attendance</h3>
                  <div className="edu-attendance-bar-row">
                    {attendance.map((a, i) => (
                      <div
                        key={i}
                        className="edu-attendance-bar-seg"
                        style={{ flex: a.value, background: a.color }}
                        title={`${a.label}: ${a.value}%`}
                      ></div>
                    ))}
                  </div>
                  <div className="edu-attendance-list">
                    {attendance.map((a, i) => (
                      <div key={i} className="edu-attendance-row">
                        <span className="edu-attendance-dot" style={{ background: a.color }}></span>
                        <span className="edu-attendance-label">{a.label}</span>
                        <span className="edu-attendance-value">{a.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Revenue + Calendar */}
              <div className="edu-bottom-section">
                <div className="edu-revenue-box">
                  <h3 className="edu-box-title">Revenue Statistic</h3>
                  <div className="edu-revenue-legend">
                    <span className="edu-legend-item">
                      <span className="edu-legend-dot" style={{ background: "#14b8a6" }}></span>
                      Total Fee: <strong>$500</strong>
                    </span>
                    <span className="edu-legend-item">
                      <span className="edu-legend-dot" style={{ background: "#f97316" }}></span>
                      Collected Fee: <strong>$300</strong>
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={revenueData} barSize={14} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={v => `${v/1000}0k`} />
                      <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                      <Bar dataKey="total" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Total Fee" label={{ position: "top", fontSize: 10, fill: "#14b8a6" }} />
                      <Bar dataKey="collected" fill="#f97316" radius={[4, 4, 0, 0]} name="Collected Fee" label={{ position: "top", fontSize: 10, fill: "#f97316" }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {/* Calendar */}
                <div className="edu-calendar-box">
                  <h3 className="edu-box-title">Calendar</h3>
                  <div className="edu-calendar">
                    <div className="edu-cal-header">
                      <button className="edu-cal-nav" onClick={prevMonth}><FaChevronLeft /></button>
                      <span className="edu-cal-month">{MONTH_NAMES[calMonth]} {calYear}</span>
                      <button className="edu-cal-nav" onClick={nextMonth}><FaChevronRight /></button>
                    </div>
                    <div className="edu-cal-grid">
                      {DAYS.map(d => (
                        <div key={d} className="edu-cal-day-name">{d}</div>
                      ))}
                      {calDays.map((d, i) => (
                        <div
                          key={i}
                          className={`edu-cal-day${d === null ? " empty" : ""}${d === todayDate ? " today" : ""}`}
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}