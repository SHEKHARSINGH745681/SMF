import React from "react";
import "./StudentDetail.css";

export default function StudentDetail() {
  // Sample data (replace with props or API data as needed)
  const student = {
    name: "Seth Hallam",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=seth",
    admNo: "AD1256589",
    roll: 10,
    class: "1 (A), 2(A), 3(A)",
    section: "A",
    gender: "Male",
    dob: "10 Nov 2006",
    category: "General",
    academicYear: "Jun 2025/2026",
    phone: "789678456",
    email: "set@example.com",
    status: "Active",
  };
  const parents = [
    {
      name: "Robert Fox",
      role: "Father",
      avatar: "https://randomuser.me/api/portraits/men/18.jpg",
      phone: "+19854 65642",
      email: "father@example.com",
    },
    {
      name: "Brooklyn Simmons",
      role: "Mother",
      avatar: "https://randomuser.me/api/portraits/women/19.jpg",
      phone: "+19854 65642",
      email: "mother@example.com",
    },
  ];

  return (
    <div className="sd-wrap">
      <div className="sd-header">
        <div>
          <h2 className="sd-title">Student Details</h2>
          <p className="sd-breadcrumb">Dashboard / Student / Student Details</p>
        </div>
        <button className="sd-login-btn">&#128274; Login Details</button>
      </div>

      <div className="sd-main-card as-card">
        <div className="sd-profile">
          <img className="sd-avatar" src={student.avatar} alt={student.name} />
          <div className="sd-name">{student.name}</div>
          <div className="sd-adm">Admission No: <span className="sd-adm-highlight">{student.admNo}</span></div>
          <div className="sd-adm2">Admission No: <span>{student.roll}</span></div>
          <div className="sd-actions">
            <button className="sd-suspend">Suspend</button>
            <button className="sd-edit">Edit</button>
          </div>
        </div>
        <div className="sd-info-card">
          <div className="sd-status-row">
            <span className="sd-status-active">Active</span>
          </div>
          <div className="sd-info-grid">
            <div><b>Class</b> <span>: {student.class}</span></div>
            <div><b>Section</b> <span>: {student.section}</span></div>
            <div><b>Roll No</b> <span>: {student.roll}</span></div>
            <div><b>Gender</b> <span>: {student.gender}</span></div>
            <div><b>Date Of Birth</b> <span>: {student.dob}</span></div>
            <div><b>Category</b> <span>: {student.category}</span></div>
            <div><b>Academic Year</b> <span>: {student.academicYear}</span></div>
            <div><b>Phone Number</b> <span>: <a href={`tel:${student.phone}`}>{student.phone}</a></span></div>
            <div><b>Email</b> <span>: <a href={`mailto:${student.email}`}>{student.email}</a></span></div>
          </div>
        </div>
      </div>

      <div className="sd-tabs">
        <div className="sd-tab sd-tab-active">&#128100; Student Details</div>
        <div className="sd-tab">Attendance</div>
        <div className="sd-tab">Leave</div>
        <div className="sd-tab">Fees</div>
        <div className="sd-tab">Exam</div>
        <div className="sd-tab">Library</div>
      </div>

      <div className="sd-parents-card as-card">
        <div className="sd-parents-title">Parent Guardian Detail</div>
        <div className="sd-parents-list">
          {parents.map((p, i) => (
            <div className="sd-parent-row" key={i}>
              <div className="sd-parent-main">
                <img className="sd-parent-avatar" src={p.avatar} alt={p.name} />
                <div>
                  <div className="sd-parent-name">{p.name}</div>
                  <div className="sd-parent-role">{p.role}</div>
                </div>
              </div>
              <div className="sd-parent-phone">{p.phone}</div>
              <div className="sd-parent-email">{p.email}</div>
              {i === 1 && (
                <button className="sd-parent-settings">&#9881;</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
