import React, { useState } from "react";
import "./TeacherList.css";
import AddTeacher from "./AddTeacher";

const TEACHERS = [
  {
    sl: "01",
    empNo: "EMP001",
    name: "Dr. John Doe",
    subject: "Mathematics",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    experience: "5 years",
    gender: "Male",
    mobile: "209.555.0104",
    category: "General",
    status: "Active",
  },
  {
    sl: "02",
    empNo: "EMP002",
    name: "Ms. Jane Smith",
    subject: "Science",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    experience: "3 years",
    gender: "Female",
    mobile: "209.555.1198",
    category: "Special",
    status: "Inactive",
  },
  {
    sl: "03",
    empNo: "EMP003",
    name: "Mr. Robert Johnson",
    subject: "History",
    avatar: "https://randomuser.me/api/portraits/men/13.jpg",
    experience: "7 years",
    gender: "Male",
    mobile: "207.445.9821",
    category: "OBC",
    status: "Active",
  },
  {
    sl: "04",
    empNo: "EMP004",
    name: "Jane Cooper",
    subject: "English",
    avatar: "https://randomuser.me/api/portraits/women/14.jpg",
    experience: "8 years",
    gender: "Female",
    mobile: "204.658.4421",
    category: "Special",
    status: "Inactive",
  },
  {
    sl: "05",
    empNo: "EMP005",
    name: "Esther Howard",
    subject: "Biology",
    avatar: "https://randomuser.me/api/portraits/women/15.jpg",
    experience: "4 years",
    gender: "Female",
    mobile: "209.875.9987",
    category: "General",
    status: "Active",
  },
  {
    sl: "06",
    empNo: "EMP006",
    name: "Albert Flores",
    subject: "Physics",
    avatar: "https://randomuser.me/api/portraits/men/16.jpg",
    experience: "6 years",
    gender: "Male",
    mobile: "208.324.1110",
    category: "OBC",
    status: "Inactive",
  },
  {
    sl: "07",
    empNo: "EMP007",
    name: "Jenny Wilson",
    subject: "Computer Science",
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    experience: "5 years",
    gender: "Female",
    mobile: "206.211.4567",
    category: "General",
    status: "Active",
  },
  {
    sl: "08",
    empNo: "EMP008",
    name: "Robert Fox",
    subject: "Geography",
    avatar: "https://randomuser.me/api/portraits/men/18.jpg",
    experience: "2 years",
    gender: "Male",
    mobile: "201.123.4567",
    category: "General",
    status: "Active",
  },
  {
    sl: "09",
    empNo: "EMP009",
    name: "Savannah Nguyen",
    subject: "Chemistry",
    avatar: "https://randomuser.me/api/portraits/women/19.jpg",
    experience: "9 years",
    gender: "Female",
    mobile: "205.678.9012",
    category: "OBC",
    status: "Inactive",
  },
  {
    sl: "10",
    empNo: "EMP010",
    name: "Cameron Williamson",
    subject: "Economics",
    avatar: "https://randomuser.me/api/portraits/men/20.jpg",
    experience: "10 years",
    gender: "Male",
    mobile: "203.456.7890",
    category: "General",
    status: "Active",
  },
];

export default function TeacherList({ onAddTeacher }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openMenu, setOpenMenu] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [filter, setFilter] = useState({ subject: "", gender: "", status: "" });

  const handleAddTeacherClick = () => {
    if (typeof onAddTeacher === "function") {
      onAddTeacher();
      return;
    }
    setShowAddTeacher(true);
  };

  if (showAddTeacher) {
    return <AddTeacher onBack={() => setShowAddTeacher(false)} />;
  }

  const filtered = TEACHERS.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch = t.name.toLowerCase().includes(q) || t.empNo.toLowerCase().includes(q);
    const matchesSubject = !filter.subject || t.subject === filter.subject;
    const matchesGender = !filter.gender || t.gender === filter.gender;
    const matchesStatus = !filter.status || t.status === filter.status;

    return matchesSearch && matchesSubject && matchesGender && matchesStatus;
  }).slice(0, rowsPerPage);

  const toggleSelect = (sl) => {
    setSelected((prev) => (prev.includes(sl) ? prev.filter((x) => x !== sl) : [...prev, sl]));
  };

  const toggleAll = () => {
    setSelected((prev) => (prev.length === filtered.length ? [] : filtered.map((t) => t.sl)));
  };

  return (
    <div className="sl-wrap">
      <div className="sl-header">
        <div>
          <h2 className="sl-title">Teacher List</h2>
          <p className="sl-breadcrumb">Dashboard / Teacher List</p>
        </div>
        <button className="sl-add-btn" onClick={handleAddTeacherClick}>
          Add Teacher
        </button>
      </div>

      <div className="sl-toolbar">
        <button className="sl-export-btn">Export</button>
        <div className="sl-search-wrap">
          <span className="sl-search-icon">🔍</span>
          <input
            className="sl-search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="sl-filter-btn" onClick={() => setShowFilter(true)}>
          Filter
        </button>
        <div className="sl-rows-wrap">
          <span className="sl-rows-label">Rows per page:</span>
          <select
            className="sl-rows-select"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
      </div>

      {showFilter && (
        <div className="sl-filter-modal-bg" onClick={() => setShowFilter(false)}>
          <div className="sl-filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sl-filter-header">
              <span>Filter</span>
              <button className="sl-filter-close" onClick={() => setShowFilter(false)}>
                ×
              </button>
            </div>

            <div className="sl-filter-grid">
              <div className="sl-filter-field">
                <label>Subject</label>
                <select value={filter.subject} onChange={(e) => setFilter((f) => ({ ...f, subject: e.target.value }))}>
                  <option value="">All Subjects</option>
                  {[
                    "Mathematics",
                    "Science",
                    "History",
                    "English",
                    "Biology",
                    "Physics",
                    "Computer Science",
                    "Geography",
                    "Chemistry",
                    "Economics",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="sl-filter-field">
                <label>Gender</label>
                <select value={filter.gender} onChange={(e) => setFilter((f) => ({ ...f, gender: e.target.value }))}>
                  <option value="">All Genders</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div className="sl-filter-field">
                <label>Status</label>
                <select value={filter.status} onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}>
                  <option value="">All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            <div className="sl-filter-actions">
              <button
                className="sl-filter-reset"
                onClick={() => setFilter({ subject: "", gender: "", status: "" })}
              >
                Reset
              </button>
              <button className="sl-filter-apply" onClick={() => setShowFilter(false)}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sl-table-wrap">
        <table className="sl-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} />
              </th>
              <th>S.L</th>
              <th>Employee No</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Experience</th>
              <th>Gender</th>
              <th>Mobile Number</th>
              <th>Category</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.sl} className={selected.includes(t.sl) ? "selected" : ""}>
                <td>
                  <input type="checkbox" checked={selected.includes(t.sl)} onChange={() => toggleSelect(t.sl)} />
                </td>
                <td className="sl-sl">{t.sl}</td>
                <td className="sl-adm">{t.empNo}</td>
                <td className="sl-name-cell">
                  <img src={t.avatar} alt={t.name} className="sl-avatar" />
                  <div>
                    <div className="sl-name">{t.name}</div>
                    <div className="sl-roll">Subject: <strong>{t.subject}</strong></div>
                  </div>
                </td>
                <td>{t.subject}</td>
                <td>{t.experience}</td>
                <td>{t.gender}</td>
                <td>{t.mobile}</td>
                <td>{t.category}</td>
                <td>
                  <span className={`sl-status ${t.status === "Active" ? "active" : "inactive"}`}>{t.status}</span>
                </td>
                <td className="sl-action-cell">
                  <button className="sl-dots" onClick={() => setOpenMenu(openMenu === t.sl ? null : t.sl)}>
                    ⋮
                  </button>
                  {openMenu === t.sl && (
                    <div className="sl-menu">
                      <button onClick={() => setOpenMenu(null)}>Edit</button>
                      <button onClick={() => setOpenMenu(null)}>Delete</button>
                      <button onClick={() => setOpenMenu(null)}>View</button>
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
