import React, { useState } from "react";
import "./StudentList.css";
import AddStudent from "./AddStudent";

const STUDENTS = [
  { sl: "01", admNo: "AD52365", name: "Kathryn Murphy", roll: 12, avatar: "https://randomuser.me/api/portraits/men/11.jpg", class: "Class 1 (A)", dob: "05 May 2012", gender: "Male", mobile: "209.555.0104", category: "General", status: "Active" },
  { sl: "02", admNo: "AD52365", name: "Floyd Miles", roll: 1, avatar: "https://randomuser.me/api/portraits/women/12.jpg", class: "Class 2 (B)", dob: "05 May 2012", gender: "Female", mobile: "209.555.0104", category: "Special", status: "Inactive" },
  { sl: "03", admNo: "AD52367", name: "Cody Fisher", roll: 7, avatar: "https://randomuser.me/api/portraits/men/13.jpg", class: "Class 3 (A)", dob: "12 Feb 2013", gender: "Male", mobile: "207.445.9821", category: "OBC", status: "Active" },
  { sl: "04", admNo: "AD52368", name: "Jane Cooper", roll: 8, avatar: "https://randomuser.me/api/portraits/women/14.jpg", class: "Class 4 (C)", dob: "17 Mar 2014", gender: "Female", mobile: "204.658.4421", category: "Special", status: "Inactive" },
  { sl: "05", admNo: "AD52369", name: "Esther Howard", roll: 15, avatar: "https://randomuser.me/api/portraits/women/15.jpg", class: "Class 5 (B)", dob: "25 Jul 2013", gender: "Female", mobile: "209.875.9987", category: "General", status: "Active" },
  { sl: "06", admNo: "AD52370", name: "Albert Flores", roll: 3, avatar: "https://randomuser.me/api/portraits/men/16.jpg", class: "Class 6 (A)", dob: "08 Dec 2011", gender: "Male", mobile: "208.324.1110", category: "OBC", status: "Inactive" },
  { sl: "07", admNo: "AD52371", name: "Jenny Wilson", roll: 9, avatar: "https://randomuser.me/api/portraits/women/17.jpg", class: "Class 7 (C)", dob: "19 Sep 2010", gender: "Female", mobile: "206.211.4567", category: "General", status: "Active" },
  { sl: "08", admNo: "AD52372", name: "Robert Fox", roll: 5, avatar: "https://randomuser.me/api/portraits/men/18.jpg", class: "Class 8 (B)", dob: "22 Jan 2011", gender: "Male", mobile: "201.123.4567", category: "General", status: "Active" },
  { sl: "09", admNo: "AD52373", name: "Savannah Nguyen", roll: 11, avatar: "https://randomuser.me/api/portraits/women/19.jpg", class: "Class 9 (A)", dob: "14 Jun 2010", gender: "Female", mobile: "205.678.9012", category: "OBC", status: "Inactive" },
  { sl: "10", admNo: "AD52374", name: "Cameron Williamson", roll: 6, avatar: "https://randomuser.me/api/portraits/men/20.jpg", class: "Class 10 (B)", dob: "30 Oct 2009", gender: "Male", mobile: "203.456.7890", category: "General", status: "Active" },
];

export default function StudentList({ onAddStudent }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openMenu, setOpenMenu] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [filter, setFilter] = useState({ class: "", section: "", gender: "", status: "" });

  const handleAddStudentClick = () => {
    if (typeof onAddStudent === "function") {
      onAddStudent();
      return;
    }
    setShowAddStudent(true);
  };

  if (showAddStudent) {
    return <AddStudent onBack={() => setShowAddStudent(false)} />;
  }

  const filtered = STUDENTS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admNo.toLowerCase().includes(search.toLowerCase());
    const matchesClass = !filter.class || s.class === filter.class;
    const matchesSection = !filter.section || s.class.includes(`(${filter.section})`);
    const matchesGender = !filter.gender || s.gender === filter.gender;
    const matchesStatus = !filter.status || s.status === filter.status;
    return matchesSearch && matchesClass && matchesSection && matchesGender && matchesStatus;
  }).slice(0, rowsPerPage);

  const toggleSelect = (sl) =>
    setSelected(prev => prev.includes(sl) ? prev.filter(x => x !== sl) : [...prev, sl]);

  const toggleAll = () =>
    setSelected(prev => prev.length === filtered.length ? [] : filtered.map(s => s.sl));

  return (
    <div className="sl-wrap">
      {/* Header */}
      <div className="sl-header">
        <div>
          <h2 className="sl-title">Student List</h2>
          <p className="sl-breadcrumb">Dashboard / Student List</p>
        </div>
        <button className="sl-add-btn" onClick={handleAddStudentClick}>Add Student</button>
      </div>

      {/* Toolbar */}
      <div className="sl-toolbar">
        <button className="sl-export-btn">📄 Export ▾</button>
        <div className="sl-search-wrap">
          <span className="sl-search-icon">🔍</span>
          <input
            className="sl-search"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="sl-filter-btn" onClick={() => setShowFilter(true)}>⚙ Filter ▾</button>
        <div className="sl-rows-wrap">
          <span className="sl-rows-label">Rows per page:</span>
          <select className="sl-rows-select" value={rowsPerPage} onChange={e => setRowsPerPage(Number(e.target.value))}>
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <div className="sl-filter-modal-bg" onClick={() => setShowFilter(false)}>
          <div className="sl-filter-modal" onClick={e => e.stopPropagation()}>
            <div className="sl-filter-header">
              <span>Filter</span>
              <button className="sl-filter-close" onClick={() => setShowFilter(false)}>×</button>
            </div>
            <div className="sl-filter-grid">
              <div className="sl-filter-field">
                <label>Class</label>
                <select value={filter.class} onChange={e => setFilter(f => ({ ...f, class: e.target.value }))}>
                  <option value="">All Classes</option>
                  {["Class 1 (A)","Class 1 (B)","Class 1 (C)","Class 2 (A)","Class 2 (B)","Class 2 (C)",
                    "Class 3 (A)","Class 3 (B)","Class 3 (C)","Class 4 (A)","Class 4 (B)","Class 4 (C)",
                    "Class 5 (A)","Class 5 (B)","Class 5 (C)","Class 6 (A)","Class 6 (B)","Class 6 (C)",
                    "Class 7 (A)","Class 7 (B)","Class 7 (C)","Class 8 (A)","Class 8 (B)","Class 8 (C)",
                    "Class 9 (A)","Class 9 (B)","Class 9 (C)","Class 10 (A)","Class 10 (B)","Class 10 (C)"
                  ].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="sl-filter-field">
                <label>Section</label>
                <select value={filter.section} onChange={e => setFilter(f => ({ ...f, section: e.target.value }))}>
                  <option value="">All Sections</option>
                  <option>A</option><option>B</option><option>C</option>
                </select>
              </div>
              <div className="sl-filter-field">
                <label>Gender</label>
                <select value={filter.gender} onChange={e => setFilter(f => ({ ...f, gender: e.target.value }))}>
                  <option value="">All Genders</option>
                  <option>Male</option><option>Female</option>
                </select>
              </div>
              <div className="sl-filter-field">
                <label>Status</label>
                <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
                  <option value="">All Status</option>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
            </div>
            <div className="sl-filter-actions">
              <button className="sl-filter-reset" onClick={() => setFilter({ class: "", section: "", gender: "", status: "" })}>Reset</button>
              <button className="sl-filter-apply" onClick={() => setShowFilter(false)}>Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="sl-table-wrap">
        <table className="sl-table">
          <thead>
            <tr>
              <th><input type="checkbox" checked={selected.length === filtered.length} onChange={toggleAll} /></th>
              <th>S.L ↑</th>
              <th>Admission No ⇅</th>
              <th>Name ⇅</th>
              <th>Class ⇅</th>
              <th>Date of Birth ⇅</th>
              <th>Gender ⇅</th>
              <th>Mobile Number ⇅</th>
              <th>Category ⇅</th>
              <th>Status ⇅</th>
              <th>Action ⇅</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.sl} className={selected.includes(s.sl) ? "selected" : ""}>
                <td><input type="checkbox" checked={selected.includes(s.sl)} onChange={() => toggleSelect(s.sl)} /></td>
                <td className="sl-sl">{s.sl}</td>
                <td className="sl-adm">{s.admNo}</td>
                <td className="sl-name-cell">
                  <img src={s.avatar} alt={s.name} className="sl-avatar" />
                  <div>
                    <div className="sl-name">{s.name}</div>
                    <div className="sl-roll">Roll No: <strong>{s.roll}</strong></div>
                  </div>
                </td>
                <td>{s.class}</td>
                <td>{s.dob}</td>
                <td>{s.gender}</td>
                <td>{s.mobile}</td>
                <td>{s.category}</td>
                <td>
                  <span className={`sl-status ${s.status === "Active" ? "active" : "inactive"}`}>
                    {s.status}
                  </span>
                </td>
                <td className="sl-action-cell">
                  <button className="sl-dots" onClick={() => setOpenMenu(openMenu === s.sl ? null : s.sl)}>⋮</button>
                  {openMenu === s.sl && (
                    <div className="sl-menu">
                      <button onClick={() => setOpenMenu(null)}>✏ Edit</button>
                      <button onClick={() => setOpenMenu(null)}>🗑 Delete</button>
                      <button onClick={() => setOpenMenu(null)}>👁 View</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}