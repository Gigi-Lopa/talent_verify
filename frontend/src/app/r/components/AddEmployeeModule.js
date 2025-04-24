"use client"
import React, { useState, useRef } from 'react'
import "bootstrap/dist/css/bootstrap.css"
import styles from "@/app/styles/main.module.css"
import "@/app/styles/bootstrap-icons/bootstrap-icons.css"

function AddEmployeeModule({ close_module, departments }) {
  let [department, set_department] = useState("")
  let [file, set_file] = useState(null)
  let [status, set_status] = useState({ success: false, error: false })
  let [batch_status, set_batch_status] = useState({ success: false, error: false })
  let [is_dragging, set_is_dragging] = useState(false)
  let [uploading, set_uploading] = useState(false)
  
  let input_ref = useRef()

  let [formData, setFormData] = useState({
    emp_name: "",
    emp_id: "",
    role: "",
    start_date: "",
    end_date: "",
    duties: ""
  })

  let formatDate = (date) => {
    if (!date) return ''
    let d = new Date(date)
    return `${d.getFullYear()}-${(`0${d.getMonth() + 1}`).slice(-2)}-${(`0${d.getDate()}`).slice(-2)}`
  }

  let validate_file = (file) => {
    if (file.type === "text/csv") {
      return true
    } else {
      alert("Invalid file. Upload [.csv ]")
      return false
    }
  }
    let RefreshPage = ()=>{
        location.reload()
    }

  let handleDrop = (e) => {
    e.preventDefault()
    set_is_dragging(false)
    if (validate_file(e.dataTransfer.files[0])) {
      set_file(e.dataTransfer.files[0])
    }
  }

  let handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  let handleBatchEMPUpload = async () => {  
    let formData = new FormData()
    formData.append("file", file)
    formData.append("company_id", localStorage.getItem("company_id"))
  
    try {
      set_uploading(true)
      let response = await fetch("http://127.0.0.1:8000/employees/batch-upload/", {
        method: "POST",
        body: formData
      })
  
      let data = await response.json()
      set_batch_status({success: !!data, error :!data})

    } catch (error) {
      console.error(error)
      set_status({ success: false, error: true })
    } finally {
        setTimeout(() => {set_status({ success: false, error: false }); RefreshPage()}, 3500)
      }
  }
  
  let handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let start_date = formatDate(formData.start_date)
      let end_date = formatDate(formData.end_date)
      set_uploading(true)
      let response = await fetch("http://127.0.0.1:8000/add/emp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.emp_name,
          employee_id: formData.emp_id,
          department,
          company: localStorage.getItem("company_id"),
          role: formData.role,
          start_date,
          end_date,
          duties: formData.duties
        })
      })
      let data = await response.json()
      console.log(data)
      set_status({ success: !!data, error: !data })
    } catch (err) {
      console.log(err)
      set_status({ success: false, error: true })
    } finally {
      setTimeout(() =>{set_status({ success: false, error: false }); RefreshPage()}, 3500)
    }
  }

  return (
    <div className={styles.module}>
      <div className={styles.module_container} style={{ width: "70%" }}>
        <div className={styles.module_content}>
          <div className={`${styles.w_100} ${styles.flex} ${styles.flex_row} ${styles.space_between}`}>
            <div className={`${styles.upload_sec} ${styles.w_45}`}>
              <div className={styles.drop_zone}
                onDragOver={(e) => {e.preventDefault(); set_is_dragging(true)}}
                onDrop={handleDrop}
                onDragLeave={() => set_is_dragging(false)}>
                {!is_dragging && !file ? (
                  <>
                    <h4>Drag and Drop file to upload</h4>
                    <input
                      type='file'
                      hidden
                      accept='.csv'
                      onChange={(e) => validate_file(e.target.files[0]) && set_file(e.target.files[0])}
                      ref={input_ref}
                    />
                    <button className={`${styles.btn} ${styles.btn_primary}`} onClick={() => input_ref.current.click()}>Select Files</button>
                  </>
                ) : !is_dragging && file ? (
                  <>
                    <h6>{file.name}</h6>
                    <button className={`${styles.btn} ${styles.btn_primary}`} onClick={handleBatchEMPUpload} disabled = {uploading}>{
                        !uploading ? "Upload" : "Uploading file.."}</button>
                  </>
                ) : (
                  <span className='bi bi-cloud-arrow-up'></span>
                )}
              </div>
              {
                batch_status.success &&  <div className='alert alert-success'>Employees Added</div>
              }
              {
                batch_status.error && <div className='alert alert-danger'>File uploud Failure</div>
              }
            </div>

            <div className={`${styles.add_emp} ${styles.w_45}`}>
              <form onSubmit={handleSubmit}>
                <div className={styles.form_group}>
                  <input
                    placeholder="Full name"
                    type="text"
                    name="emp_name"
                    onChange={handleInputChange}
                    value={formData.emp_name}
                    className={`${styles.input_form} ${styles.input_success}`}
                  />
                </div>

                <div className={styles.form_group}>
                  <input
                    placeholder="Employee ID"
                    type="text"
                    name="emp_id"
                    onChange={handleInputChange}
                    value={formData.emp_id}
                     className={`${styles.input_form} ${styles.input_success}`}
                  />
                </div>

                <div className={`${styles.w_100} ${styles.flex} ${styles.flex_row} ${styles.space_between}`}>
                  <label className={styles.form_label}>Start Date</label>
                  <label className={styles.form_label}>End Date</label>
                </div>

                <div className={`${styles.form_group} ${styles.space_between}`}>
                  <input
                    type="date"
                    name="start_date"
                    onChange={handleInputChange}
                    value={formData.start_date}
                     className={`${styles.input_form} ${styles.input_success}`}
                    style={{ width: "45%" }}
                  />
                  <input
                    type="date"
                    name="end_date"
                    onChange={handleInputChange}
                    value={formData.end_date}
                     className={`${styles.input_form} ${styles.input_success}`}
                    style={{ width: "45%" }}
                  />
                </div>

                <label>Department</label>
                <div className={`${styles.form_group} ${styles.space_between}`}>
                  <select
                     className={`${styles.input_form} ${styles.input_success}`}
                    style={{ width: "45%" }}
                    name="department"
                    onChange={(e) => set_department(e.target.value)}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dep => (
                      <option key={dep.id} value={dep.id}>{dep.name}</option>
                    ))}
                  </select>

                  <input
                    placeholder="Role"
                    type="text"
                    name="role"
                    onChange={handleInputChange}
                    value={formData.role}
                     className={`${styles.input_form} ${styles.input_success}`}
                    style={{ width: "45%" }}
                  />
                </div>

                <div className={styles.form_group}>
                  <textarea
                    placeholder="Duties"
                    name="duties"
                    onChange={handleInputChange}
                    value={formData.duties}
                     className={`${styles.input_form} ${styles.input_success}`}
                  />
                </div>

                {status.success && <div className='alert alert-success'>Employee registered.</div>}
                {status.error && <div className='alert alert-danger'>An error occurred.</div>}

                <div className={styles.bttm_btns}>
                  <button type="submit" className={`${styles.btn} ${styles.btn_primary}`}>
                    Save
                  </button>
                  <button type="button" onClick={close_module} className={`${styles.btn} ${styles.btn_danger}`} style={{ marginLeft: "15px" }}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddEmployeeModule
