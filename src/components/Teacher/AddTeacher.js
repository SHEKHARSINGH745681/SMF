import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddTeacher.css";
import API_BASE_URL from "../../apiConfig";

function FileDropZone({ name, onChange }) {
	return (
		<div className="at-file-drop" onClick={() => document.getElementById(name).click()}>
			<span>Drag and drop a file here or click</span>
			<input id={name} type="file" name={name} style={{ display: "none" }} onChange={onChange} />
		</div>
	);
}

function AddTeacher(props) {
	const [form, setForm] = useState({ gender: "Male", bloodGroup: "A+" });
	const [showPass, setShowPass] = useState(false);
	const onBack = props.onBack || (() => {});

	const handleChange = (e) => {
		const { name, value, type, files } = e.target;
		setForm((prev) => ({ ...prev, [name]: type === "file" ? (files[0] ? files[0].name : "") : value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(`${API_BASE_URL}/api/Teacher`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				toast.error(data.message || "Failed to add teacher.", {
					position: "top-right",
					autoClose: 2500,
					theme: "colored",
				});
				return;
			}

			toast.success("Teacher added successfully!", {
				position: "top-right",
				autoClose: 2500,
				theme: "colored",
			});
			setForm({ gender: "Male", bloodGroup: "A+" });
		} catch {
			toast.error("Network error. Please try again.", {
				position: "top-right",
				autoClose: 2500,
				theme: "colored",
			});
		}
	};

	return (
		<div className="at-wrap">
			<ToastContainer />

			<div className="at-header">
				<h2 className="at-title">Add New Teacher</h2>
				<p className="at-breadcrumb">Dashboard / Teacher / Add New Teacher</p>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="at-card">
					<h3 className="at-card-title">Personal Info</h3>
					<div className="at-grid-4">
						<div className="at-field">
							<label>Academic Year <span className="req">*</span></label>
							<select name="academicYear" onChange={handleChange}>
								<option>Jun 2025/2026</option>
								<option>Jun 2026/2027</option>
							</select>
						</div>
						<div className="at-field">
							<label>Department <span className="req">*</span></label>
							<input name="department" placeholder="Enter department" onChange={handleChange} />
						</div>
						<div className="at-field">
							<label>Designation <span className="req">*</span></label>
							<input name="designation" placeholder="Enter designation" onChange={handleChange} />
						</div>
						<div className="at-field">
							<label>Employee ID <span className="req">*</span></label>
							<input name="employeeId" placeholder="Enter employee ID" onChange={handleChange} />
						</div>

						<div className="at-field">
							<label>Full Name <span className="req">*</span></label>
							<input name="name" placeholder="Enter full name" onChange={handleChange} />
						</div>
						<div className="at-field">
							<label>Gender</label>
							<select name="gender" value={form.gender} onChange={handleChange}>
								<option>Male</option>
								<option>Female</option>
							</select>
						</div>
						<div className="at-field">
							<label>Date Of Birth <span className="req">*</span></label>
							<input type="date" name="dob" onChange={handleChange} />
						</div>
						<div className="at-field">
							<label>Blood Group</label>
							<select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
								{["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((b) => (
									<option key={b}>{b}</option>
								))}
							</select>
						</div>

						<div className="at-field">
							<label>Phone Number <span className="req">*</span></label>
							<input name="phone" placeholder="Enter phone number" onChange={handleChange} />
						</div>
						<div className="at-field">
							<label>Email <span className="req">*</span></label>
							<input name="email" placeholder="Enter email" onChange={handleChange} />
						</div>
						<div className="at-field at-span-2">
							<label>Teacher Photo <span className="req">*</span></label>
							<FileDropZone name="teacherPhoto" onChange={handleChange} />
						</div>
					</div>
				</div>

				<div className="at-card">
					<h3 className="at-card-title">Qualification & Experience</h3>
					<div className="at-grid-4">
						<div className="at-field">
							<label>Highest Qualification</label>
							<input name="qualification" placeholder="Enter qualification" onChange={handleChange} />
						</div>
						<div className="at-field">
							<label>Specialization</label>
							<input name="specialization" placeholder="Enter specialization" onChange={handleChange} />
						</div>
						<div className="at-field">
							<label>Experience (Years)</label>
							<input name="experience" placeholder="Enter years" onChange={handleChange} />
						</div>
						<div className="at-field">
							<label>Date Of Joining</label>
							<input type="date" name="joiningDate" onChange={handleChange} />
						</div>

						<div className="at-field at-span-2">
							<label>Previous School</label>
							<input name="previousSchool" placeholder="Enter previous school" onChange={handleChange} />
						</div>
						<div className="at-field at-span-2">
							<label>Notes</label>
							<input name="notes" placeholder="Additional info" onChange={handleChange} />
						</div>
					</div>
				</div>

				<div className="at-half-row">
					<div className="at-card at-half">
						<h3 className="at-card-title">Address</h3>
						<div className="at-grid-2">
							<div className="at-field">
								<label>Current Address</label>
								<input name="currentAddress" placeholder="Enter current address" onChange={handleChange} />
							</div>
							<div className="at-field">
								<label>Permanent Address</label>
								<input name="permanentAddress" placeholder="Enter permanent address" onChange={handleChange} />
							</div>
						</div>
					</div>

					<div className="at-card at-half">
						<h3 className="at-card-title">Bank Details</h3>
						<div className="at-grid-2">
							<div className="at-field">
								<label>Bank Account Number</label>
								<input name="accountNumber" placeholder="Enter account number" onChange={handleChange} />
							</div>
							<div className="at-field">
								<label>Bank Name</label>
								<input name="bankName" placeholder="Enter bank name" onChange={handleChange} />
							</div>
							<div className="at-field">
								<label>IFSC Code</label>
								<input name="ifsc" placeholder="Enter IFSC code" onChange={handleChange} />
							</div>
							<div className="at-field">
								<label>National ID</label>
								<input name="nationalId" placeholder="Enter national ID" onChange={handleChange} />
							</div>
						</div>
					</div>
				</div>

				<div className="at-half-row">
					<div className="at-card at-half">
						<h3 className="at-card-title">Upload Documents</h3>
						<div className="at-grid-2">
							<div className="at-field">
								<label>Resume</label>
								<FileDropZone name="resume" onChange={handleChange} />
							</div>
							<div className="at-field">
								<label>ID Proof</label>
								<FileDropZone name="idProof" onChange={handleChange} />
							</div>
						</div>
					</div>

					<div className="at-card at-half">
						<h3 className="at-card-title">Teacher Details</h3>
						<div className="at-field">
							<label>Details</label>
							<textarea name="details" placeholder="Enter details" rows={4} onChange={handleChange} className="at-textarea" />
						</div>
					</div>
				</div>

				<div className="at-card">
					<h3 className="at-card-title">Login Details</h3>
					<div className="at-grid-2">
						<div className="at-field">
							<label>Login Email <span className="req">*</span></label>
							<input name="loginEmail" placeholder="Enter login email" onChange={handleChange} />
						</div>
						<div className="at-field">
							<label>Password <span className="req">*</span></label>
							<div className="at-pass-wrap">
								<input
									type={showPass ? "text" : "password"}
									name="password"
									placeholder="Enter password"
									onChange={handleChange}
								/>
								<button type="button" className="at-eye-btn" onClick={() => setShowPass((v) => !v)}>
									{showPass ? "Hide" : "Show"}
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="at-actions">
					<button type="button" className="at-cancel-btn" onClick={onBack}>Cancel</button>
					<button type="submit" className="at-save-btn">Save Changes</button>
				</div>
			</form>
		</div>
	);
}

export default AddTeacher;
