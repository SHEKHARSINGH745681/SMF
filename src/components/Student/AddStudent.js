import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddStudent.css";
import API_BASE_URL from "../../apiConfig";

function FileDropZone({ name, onChange }) {
  return (
    <div className="file-drop" onClick={() => document.getElementById(name).click()}>
      <span>Darg &amp; drop a file here or click</span>
      <input id={name} type="file" name={name} style={{ display: "none" }} onChange={onChange} />
    </div>
  );
}

function AddStudent(props) {
  const [form, setForm] = useState({ gender: "Male", bloodGroup: "A+" });
  const [guardian, setGuardian] = useState("Father");
  const [showPass, setShowPass] = useState(false);
  const onBack = props.onBack || (() => {});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "file" ? (files[0] ? files[0].name : "") : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/Student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, guardian }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.message || "Failed to add student.", { position: "top-right", autoClose: 2500, theme: "colored" });
        return;
      }
      toast.success("Student added successfully!", { position: "top-right", autoClose: 2500, theme: "colored" });
      setForm({ gender: "Male", bloodGroup: "A+" });
    } catch {
      toast.error("Network error. Please try again.", { position: "top-right", autoClose: 2500, theme: "colored" });
    }
  };

  return (
    <div className="as-wrap">
      <ToastContainer />

      <div className="as-header">
        <h2 className="as-title">Add New Student</h2>
        <p className="as-breadcrumb">Dashboard / Student / Add New Student</p>
      </div>

      <form onSubmit={handleSubmit}>

        {/* PERSONAL INFO */}
        <div className="as-card">
          <h3 className="as-card-title">Personal Info</h3>
          <div className="as-grid-4">
            <div className="as-field">
              <label>Academic Year <span className="req">*</span></label>
              <select name="academicYear" onChange={handleChange}>
                <option>Jun 2025/2026</option>
                <option>Jun 2026/2027</option>
              </select>
            </div>
            <div className="as-field">
              <label>Class <span className="req">*</span></label>
              <select name="class" onChange={handleChange}>
                <option>Primary</option>
                <option>Secondary</option>
                <option>Higher Secondary</option>
              </select>
            </div>
            <div className="as-field">
              <label>Section <span className="req">*</span></label>
              <select name="section" onChange={handleChange}>
                <option>Science</option>
                <option>Commerce</option>
                <option>Arts</option>
              </select>
            </div>
            <div className="as-field">
              <label>Roll Number</label>
              <input name="roll" placeholder="Enter your rollNumber" onChange={handleChange} />
            </div>

            <div className="as-field">
              <label>Admission No <span className="req">*</span></label>
              <input name="admission" placeholder="Enter admission number" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>Full Name <span className="req">*</span></label>
              <input name="name" placeholder="Enter your Full Name" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>Category <span className="req">*</span></label>
              <input name="category" placeholder="Select a Category" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div className="as-field">
              <label>Date Of Birth <span className="req">*</span></label>
              <input type="date" name="dob" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>Phone Number <span className="req">*</span></label>
              <input name="phone" placeholder="Enter your Phone Number" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>Email <span className="req">*</span></label>
              <input name="email" placeholder="Enter your Email" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>Student Photo <span className="req">*</span></label>
              <FileDropZone name="studentPhoto" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* PARENT & GUARDIAN INFO */}
        <div className="as-card">
          <h3 className="as-card-title">Parent &amp; Guardian Info</h3>
          <div className="as-grid-4">
            <div className="as-field">
              <label>Fathers Name</label>
              <input name="fatherName" placeholder="Enter Fathers Name" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>Phone Number</label>
              <input name="fatherPhone" placeholder="Enter Fathers Number" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>Father Occupation</label>
              <input name="fatherOccupation" placeholder="Enter Father Occupation" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>Fathers Photo <span className="req">*</span></label>
              <FileDropZone name="fatherPhoto" onChange={handleChange} />
            </div>

            <div className="as-field">
              <label>Mothers Name</label>
              <input name="motherName" placeholder="Enter mothers Name" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>Phone Number</label>
              <input name="motherPhone" placeholder="Enter mothers Number" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>Father Occupation</label>
              <input name="motherOccupation" placeholder="Enter Father Occupation" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>Mothers Photo <span className="req">*</span></label>
              <FileDropZone name="motherPhoto" onChange={handleChange} />
            </div>
          </div>

          {/* Select a Guardian */}
          <div className="as-guardian-section">
            <h4 className="as-sub-title">Select a Guardian</h4>
            <div className="as-radio-row">
              {["Father", "Mother", "Others"].map(g => (
                <label key={g} className="as-radio-label">
                  <input type="radio" name="guardian" value={g} checked={guardian === g} onChange={() => setGuardian(g)} />
                  {g}
                </label>
              ))}
            </div>
            <div className="as-grid-4" style={{ marginTop: 14 }}>
              <div className="as-field">
                <label>Guardian Name</label>
                <input name="guardianName" placeholder="Enter Guardian Name" onChange={handleChange} />
              </div>
              <div className="as-field">
                <label>Guardian Email</label>
                <input name="guardianEmail" placeholder="Enter Guardian Email" onChange={handleChange} />
              </div>
              <div className="as-field">
                <label>Phone Number</label>
                <input name="guardianPhone" placeholder="Enter Guardian Number" onChange={handleChange} />
              </div>
              <div className="as-field">
                <label>Father Occupation</label>
                <input name="guardianOccupation" placeholder="Enter Father Occupation" onChange={handleChange} />
              </div>
              <div className="as-field as-span-3">
                <label>Guardian Address</label>
                <input name="guardianAddress" placeholder="Enter Guardian Address" onChange={handleChange} />
              </div>
              <div className="as-field">
                <label>Guardian Photo <span className="req">*</span></label>
                <FileDropZone name="guardianPhoto" onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* MEDICAL DETAILS */}
        <div className="as-card">
          <h3 className="as-card-title">Medical Details</h3>
          <div className="as-grid-3">
            <div className="as-field">
              <label>Blood Group</label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="as-field">
              <label>Height</label>
              <input name="height" placeholder="Enter height" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>Weight</label>
              <input name="weight" placeholder="Enter Weight" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* BANK DETAILS */}
        <div className="as-card">
          <h3 className="as-card-title">Bank Details</h3>
          <div className="as-grid-4">
            <div className="as-field">
              <label>Bank Account Number</label>
              <input name="accountNumber" placeholder="Enter bank account number" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>Bank Name</label>
              <input name="bankName" placeholder="Enter bank name" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>IFSC Code</label>
              <input name="ifsc" placeholder="Enter IFSC Code" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>National Identification Number</label>
              <input name="nationalId" placeholder="Enter national identification number" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* PREVIOUS SCHOOL + ADDRESS (side by side) */}
        <div className="as-half-row">
          <div className="as-card as-half">
            <h3 className="as-card-title">Previous School Details</h3>
            <div className="as-grid-2">
              <div className="as-field">
                <label>School Name</label>
                <input name="prevSchool" placeholder="Enter school name" onChange={handleChange} />
              </div>
              <div className="as-field">
                <label>School Address</label>
                <input name="prevSchoolAddress" placeholder="Enter school address" onChange={handleChange} />
              </div>
            </div>
          </div>
          <div className="as-card as-half">
            <h3 className="as-card-title">Address</h3>
            <div className="as-grid-2">
              <div className="as-field">
                <label>Current Address</label>
                <input name="currentAddress" placeholder="Enter current address" onChange={handleChange} />
              </div>
              <div className="as-field">
                <label>Permanent Address</label>
                <input name="permanentAddress" placeholder="Enter permanent address" onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* HOSTEL + UPLOAD DOCUMENTS (side by side) */}
        <div className="as-half-row">
          <div className="as-card as-half">
            <h3 className="as-card-title">Hostel Details</h3>
            <div className="as-grid-2">
              <div className="as-field">
                <label>Hostel</label>
                <input name="hostel" placeholder="Enter Hostel" onChange={handleChange} />
              </div>
              <div className="as-field">
                <label>Room No</label>
                <input name="roomNo" placeholder="Enter Room No" onChange={handleChange} />
              </div>
            </div>
          </div>
          <div className="as-card as-half">
            <h3 className="as-card-title">Upload Documents</h3>
            <div className="as-grid-2">
              <div className="as-field">
                <label>Doc Name</label>
                <input name="docName" placeholder="Enter Doc Name" onChange={handleChange} />
              </div>
              <div className="as-field">
                <label>Guardian Photo <span className="req">*</span></label>
                <FileDropZone name="docFile" onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* STUDENT DETAILS */}
        <div className="as-card">
          <h3 className="as-card-title">Student Details</h3>
          <div className="as-field">
            <label>Details</label>
            <textarea name="details" placeholder="Enter details" rows={4} onChange={handleChange} className="as-textarea" />
          </div>
        </div>

        {/* LOGIN DETAILS */}
        <div className="as-card">
          <h3 className="as-card-title">Login Details</h3>
          <div className="as-grid-2">
            <div className="as-field">
              <label>Email <span className="req">*</span></label>
              <input name="loginEmail" placeholder="Enter Email" onChange={handleChange} />
            </div>
            <div className="as-field">
              <label>Password <span className="req">*</span></label>
              <div className="as-pass-wrap">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                />
                <button type="button" className="as-eye-btn" onClick={() => setShowPass(v => !v)}>
                  {showPass ? "👁️‍🗨️" : "👁"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="as-actions">
          <button type="button" className="as-cancel-btn" onClick={onBack}>Cancel</button>
          <button type="submit" className="as-save-btn">Save Changes</button>
        </div>

      </form>
    </div>
  );
}

export default AddStudent;