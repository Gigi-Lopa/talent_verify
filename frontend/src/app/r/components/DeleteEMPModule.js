"use client"
import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.css"
import styles from "@/app/styles/main.module.css"
import "@/app/styles/bootstrap-icons/bootstrap-icons.css"

function DeleteEMPModule({close_module, employee_id}) {
    let [deleting, set_deleting] = useState(false);
    let on_delete= async() =>{
        set_deleting(true)
        let data =  fetch(`http://127.0.0.1:8000/employee/delete/${employee_id}/`, {
            method : "DELETE"
        })
        if(data){
            set_deleting(false)
            location.href = "/"
        }
       
    }
  return (
    <div className={styles.module}>
        <div className={styles.module_container} style={{width : "30%"}}>
            <div className={styles.module_content}>
                <h5>Delete Employee {employee_id}</h5>
                <p>This action is NOT reversable. Are you sure?</p>
                <div className={`${styles.flex_row} ${styles.flex} ${styles.space_between}`}>
                    <button className={`${styles.btn } ${styles.btn_primary}`} onClick={()=>close_module()}>
                        Cancel
                    </button>
                    <button  className={`${styles.btn } ${styles.btn_danger}`} onClick={on_delete} disabled = {deleting}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DeleteEMPModule