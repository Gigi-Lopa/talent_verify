"use client"
import React, { useState, useEffect, useCallback } from 'react'
import "bootstrap/dist/css/bootstrap.css"
import styles from "@/app/styles/main.module.css"
import "@/app/styles/bootstrap-icons/bootstrap-icons.css"
import Nav from "@/app/r/components/Nav"
import DeleteEMPModule from './components/DeleteEMPModule'
import AddEmployeeModule from './components/AddEmployeeModule'

export default function Index() {
  let [deleteMode, setDeleteMode] = useState(false)
  let [addEmpMode, setAddEmpMode] = useState(false)
  let [page, setPage] = useState(1)
  let [pagination, setPagination] = useState({ previous: null, next: null })
  let [departmentsMap, setDepartmentsMap] = useState({})
  let [departments_, set_departments] = useState([])
  let [employees, setEmployees] = useState([])
  let [employeesCount, setEmployeesCount] = useState(0)
  let [status, setStatus] = useState({ noRecords: false, error: false })
  let [employee_id, set_employee_id] = useState(null)

  let getEmployeeList = useCallback(async (companyId, pageNum) => {
    try {
      let res = await fetch(`http://127.0.0.1:8000/employees?com=${companyId}&page=${pageNum}`)
      return await res.json()
    } catch {
      return null
    }
  }, [])


  let fetchData = useCallback(async () => {
    let companyId = localStorage.getItem("company_id")
    if (!companyId) return

    let data = await getEmployeeList(companyId, page)
    if (!data) {
      setStatus({ noRecords: true, error: true })
      return
    }

    let { employees, departments } = data.results
    set_departments(departments)
    if (employees.length === 0) {
      setStatus({ noRecords: true, error: false })
    } else {
      let department_map = {}
      departments.map(dep=>{
        department_map[dep.id] = dep.name
      });
      setDepartmentsMap(department_map)
      setEmployees(employees)
      setPagination({ previous: data.previous, next:data.next  })
      setEmployeesCount(data.count)
      setStatus({ noRecords: false, error: false })
     }
  }, [page, getEmployeeList])

  useEffect(() => {
    fetchData();
  }, [fetchData])

  let handlePagination = (targetPage) => {
    const url = new URL(targetPage);
    const page = url.searchParams.get('page');
    if (targetPage) setPage(page != null ? page : 1)
  }

  return (
    <div>
      {deleteMode && <DeleteEMPModule close_module={() => setDeleteMode(false)}  employee_id= {employee_id} />}
      {addEmpMode && <AddEmployeeModule close_module={() => setAddEmpMode(false)} departments={departments_} employee_id= {employee_id}/>}
      <Nav active={{ isProfile: false, isEmployee: true }} />
      <div className={styles.main}>
        <div className={styles.inner_container}>
          <div className="container">
            <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}`}>
              <h4 className={styles.header_emp}>{employeesCount} Employees Recorded</h4>
              <button onClick={() => {console.log(departmentsMap);setAddEmpMode(true)}} className={`${styles.btn} ${styles.btn_primary} ${styles.add_emp}`}>
                Add Employee <span className="bi bi-plus-lg"></span>
              </button>
            </div>

            <div className={styles.table_container}>
              <table className={styles.pricing_table}>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Start Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {status.noRecords && (
                    <tr><td colSpan={6}>No Records</td></tr>
                  )}

                  {status.error && !status.noRecords && (
                    <tr>
                      <td colSpan={6}>
                        <div className="alert alert-danger" role="alert">An error occurred. Refresh page</div>
                      </td>
                    </tr>
                  )}

                  {!status.noRecords && employees.map((emp, index) => (
                    <tr key={index}>
                      <td>{emp.employee_id}</td>
                      <td>{emp.name}</td>
                      <td>{departmentsMap[emp.department] || "Unknown"}</td>
                      <td>{emp.role}</td>
                      <td>{emp.start_date}</td>
                      <td>
                        <a href={`/r/c/profile/emp?id=${emp.employee_id}`} className={styles.a}>View</a>
                        <button onClick={() => {
                          set_employee_id(emp.employee_id);
                          setDeleteMode(true);
                          }} className={`${styles.btn} ${styles.btn_danger}`} style={{ marginLeft: "10px" }}>
                          <span className="bi bi-trash"></span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <nav aria-label="Page navigation" style={{ marginTop: "25px" }}>
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${pagination.previous == null ? "disabled" : ""}`}>
                    <a className="page-link" onClick={() => handlePagination(pagination.previous)}>Previous</a>
                  </li>
                  <li className="page-item"><a className="page-link">{page}</a></li>
                  <li className={`page-item ${pagination.next == null ? "disabled" : ""}`}>
                    <a className="page-link" onClick={() => handlePagination(pagination.next)}>Next</a>
                  </li>
                </ul>

              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
