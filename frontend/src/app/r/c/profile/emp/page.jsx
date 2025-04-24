"use client"
import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.css"
import styles from "@/app/styles/main.module.css"
import "@/app/styles/bootstrap-icons/bootstrap-icons.css"
import Nav from "@/app/r/components/Nav"
import DeleteEMPModule from '@/app/r/components/DeleteEMPModule'

function page() {
    let [delete_emp , set_delete_emp] = useState(false)
    let [emp_data, set_emp_data] = useState(null)
    

    useEffect(()=>{
        let parameters = new URLSearchParams(window.location.search)
        let emp_id = parameters.get("id")

        fetch("http://127.0.0.1:8000/employee/"+emp_id+"/")
        .then(response=> response.json())
        .then(response=>{
            if (!!response){
                set_emp_data(response)
            }
        })
        .catch(err=>alert(err))
    }, [])
  return (
    <div>
        {delete_emp && <DeleteEMPModule close_module={() => set_delete_emp(false)}  employee_id= {emp_data.employee_id} />}
        <Nav active = {{isProfile: true, isEmployee: false}}/>
        <div className={styles.main}>
            <div className={`${styles.inner_container}`} style={{width: "50%"}}>
                <div className='container'>
                    {
                        emp_data ? 
                        (
                            <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}`}>
                                <div className={`${styles.info_card} ${styles.w_45}`}>
                                    <div className={`${styles.info_card_content}`}>
                                        <div className={`${styles.flex} ${styles.flex_row} ${styles.centered}`}>
                                            <div className={styles.card_icon}>
                                                <span className='bi bi-person'></span>
                                            </div>
                                        </div>
                                        <div className={`${styles.com_head} ${styles.flex} ${styles.flex_col} ${styles.centered}`}>
                                            <h4>{emp_data.name}</h4>
                                            <span>Reg UID: {emp_data.employee_id}</span>
                                            <div className={styles.pill}>
                                                <span>{emp_data.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${styles.info_card} ${styles.w_45}`}>
                                    <div className={`${styles.info_card_content} ${styles.bd}`}>
                                        <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}  ${styles.info_line}`}>
                                            <span className={styles.topic}>Department</span>
                                            <span className={styles.reply}>{emp_data.department.trim()}</span>
                                        </div>
                                        <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}  ${styles.info_line}`}>
                                            <span className={styles.topic}>Company</span>
                                            <span className={styles.reply}>{emp_data.company.trim()}</span>
                                        </div>
                                        <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}  ${styles.info_line}`}>
                                            <span className={styles.topic}>Duties</span>
                                            <span className={styles.reply}>
                                                {emp_data.duties.split('\n').map((line, index) => (
                                                    <div key={index}>{line}</div>
                                                ))}
                                            </span>
                                        </div>
                                        <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}  ${styles.info_line}`}>
                                            <span className={styles.topic}>Start Date</span>
                                            <span className={styles.reply}>{emp_data.start_date}</span>
                                        </div>
                                        <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}  ${styles.info_line}`}>
                                            <span className={styles.topic}>End Date</span>
                                            <span className={styles.reply}>{emp_data.end_date}</span>
                                        </div>
                                    </div>
                                    <div className={`${styles.info_card_content}`} style={{marginTop:"15px"}}>
                                        <button onClick={()=>{set_delete_emp(true)}} className={`${styles.btn} ${styles.btn_danger} ${styles.btn_wd}`}> Delete</button>
                                    </div>
                                </div>
                            </div>
                        ) : <>Loading</>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default page