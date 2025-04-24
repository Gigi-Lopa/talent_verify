"use client"
import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.css"
import styles from "@/app/styles/main.module.css"
import "@/app/styles/bootstrap-icons/bootstrap-icons.css"
import Nav from "@/app/r/components/Nav"
import EditCompanyModule from '../../../components/EditCompanyModule'

function page() {
    let [departments, set_departments] = useState(["wfe","wef", "Wefewf", "fewf"]);
    let [edit_company , set_edit_company] = useState(false)
    let [company_data, set_company_data] = useState(null)

    useEffect(()=>{
        let company_id =localStorage.getItem("company_id")
        fetch("http://127.0.0.1:8000/company?com="+company_id)
        .then(response=> response.json())
        .then(response=>{
            if (!!response){
                set_company_data(response)
            }
        })
        .catch(err=>alert(err))
    }, [])
    let on_update = (data) =>{
        set_company_data(prev=> ({
            ...prev,
            [company_data.company_name] : data.name,
            [company_data.date_of_reg]: data.registration_date,
            [company_data.company_reg_number]: data.registration_number,
            [company_data.address_street] : data.address_street,
            [company_data.address_city] : data.address_city,
            [company_data.number_of_employees] : data.number_of_employees,
            [company_data.contact_person] : data.contact_person,
            [company_data.contact_phone]: data.phone,
            [company_data.email]: data.email
        }))
    }
  return (
    <div>
        { edit_company && <EditCompanyModule close_module = {()=>{set_edit_company(false)}} company_data= {company_data} update_company={on_update}/> }
        <Nav active = {{isProfile: true, isEmployee: false}}/>
        <div className={styles.main}>
            <div className={`${styles.inner_container}`} style={{width: "50%"}}>
                <div className='container'>
                    {
                        company_data ? 
                        (
                            <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}`}>
                                <div className={`${styles.info_card} ${styles.w_45}`}>
                                    <div className={`${styles.info_card_content} ${styles.bd}`}>
                                        <div className={`${styles.flex} ${styles.flex_row} ${styles.centered}`}>
                                            <div className={styles.card_icon}>
                                                <span className='bi bi-person'></span>
                                            </div>
                                        </div>
                                        <div className={`${styles.com_head} ${styles.flex} ${styles.flex_col} ${styles.centered}`}>
                                            <h4>{company_data.company_name}</h4>
                                            <span>Reg UID: {company_data.company_reg_number}</span>
                                            <div className={styles.pill}>
                                                <span>{company_data.number_of_employees} Employees</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.info_card_content} >
                                        <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between} ${styles.info_line}`}>
                                            <span className={styles.topic}>Address</span>
                                            <div className={`${styles.flex} ${styles.flex_col}`}>
                                                <span className={styles.reply}>{company_data.address_street}</span>
                                                <span className={styles.reply}>{company_data.address_city}</span>
                                            </div>
                                        </div>
                                        <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}  ${styles.info_line}`}>
                                            <span className={styles.topic}>Date Of registration</span>
                                            <span className={styles.reply}>{company_data.date_of_reg}</span>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className={`${styles.info_card} ${styles.w_45}`}>
                                    <div className={`${styles.info_card_content} ${styles.bd}`}>
                                        <span className={styles.topic}>Departments</span>
                                        {   company_data.departments.length != 0 ?
                                            <div className={styles.departments} style={{paddingTop: "15px"}}>
                                            {
                                                company_data.departments.map((department, index)=>{
                                                    return (
                                                        <div className= {styles.department} key={index}>
                                                            <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}`}>
                                                                <>{department[localStorage.getItem("company_id")]}</>
                                                            </div>  
                                                        </div>
                                                    )
                                                })
                                            }
                                            </div> :<></>
                                        }
                                    </div>
                                    <div className={`${styles.info_card_content} ${styles.bd}`}>
                                    <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}  ${styles.info_line}`}>
                                            <span className={styles.topic}>Contant Person</span>
                                            <span className={styles.reply}>{company_data.contact_person}</span>
                                        </div>
                                        <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}  ${styles.info_line}`}>
                                            <span className={styles.topic}>Phone Number</span>
                                            <span className={styles.reply}>{company_data.contact_phone}</span>
                                        </div>
                                        <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}  ${styles.info_line}`}>
                                            <span className={styles.topic}>Email</span>
                                            <span className={styles.reply}>{company_data.email}</span>
                                        </div>
                                    </div>
                                    <div className={`${styles.info_card_content}`} style={{marginTop:"15px"}}>
                                        <button onClick={()=>{set_edit_company(true)}} className={`${styles.btn} ${styles.btn_primary} ${styles.btn_wd}`}> Edit</button>
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