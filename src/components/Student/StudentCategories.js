import React, { useState } from "react";
import "./StudentCategories.css";
import { FaSearch, FaEllipsisV, FaPlus } from "react-icons/fa";

const data = [
  { id: 1, name: "General", status: "Active" },
  { id: 2, name: "Special", status: "Inactive" },
  { id: 3, name: "Physically Challenged", status: "Active" },
  { id: 4, name: "General", status: "Inactive" },
  { id: 5, name: "Special", status: "Active" },
  { id: 6, name: "Physically Challenged", status: "Inactive" },
  { id: 7, name: "General", status: "Active" },
  { id: 8, name: "Special", status: "Inactive" },
  { id: 9, name: "Physically Challenged", status: "Active" },
];

export default function StudentCategories() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [status, setStatus] = useState("Active");

  const closeDrawer = () => {
    setShowDrawer(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    closeDrawer();
  };

  return (
    <div className="sc-wrap">
      
      {/* Header */}
      <div className="sc-header">
        <div>
          <h2 className="sc-title">Student Categories</h2>
          <p className="sc-breadcrumb">Dashboard / Student Categories</p>
        </div>

        <button className="sc-add-btn" onClick={() => setShowDrawer(true)}>
          <FaPlus /> New Category
        </button>
      </div>

      {/* Toolbar */}
      <div className="sc-toolbar">
        <button className="sc-export-btn">Export ▾</button>

        <div className="sc-search-box">
          <FaSearch className="sc-search-icon" />
          <input placeholder="Search..." />
        </div>
      </div>

      {/* Table */}
      <div className="sc-table-wrap">
        <table className="sc-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>S.L</th>
              <th>Category Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td><input type="checkbox" /></td>
                <td>{String(index + 1).padStart(2, "0")}</td>
                <td>{item.name}</td>

                <td>
                  <span className={`sc-status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>

                <td>
                  <button className="sc-dots">
                    <FaEllipsisV />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDrawer && (
        <div className="sc-drawer-overlay" onClick={closeDrawer}>
          <aside className="sc-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="sc-drawer-head">
              <h3>Add New Student Category</h3>
              <button className="sc-drawer-close" onClick={closeDrawer} aria-label="Close">x</button>
            </div>

            <form className="sc-drawer-body" onSubmit={handleSave}>
              <div className="sc-field">
                <label>Student Category Name</label>
                <input
                  type="text"
                  placeholder="Enter Student Category Name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>

              <div className="sc-field">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="sc-drawer-actions">
                <button type="button" className="sc-cancel-btn" onClick={closeDrawer}>Cancel</button>
                <button type="submit" className="sc-save-btn">Save</button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}