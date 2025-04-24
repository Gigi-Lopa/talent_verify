"use client"
import React, { useState, useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.css"
import styles from "@/app/styles/main.module.css"
import "@/app/styles/bootstrap-icons/bootstrap-icons.css"

function EditCompanyModule({ company_data, close_module, update_company }) {
    let [status, set_status] = useState({
        success : false,
        error: false
    });
    let [form_data, set_form_data] = useState({
        company_name: '',
        date_of_reg: '',
        company_reg_number: '',
        address_street: '',
        address_city: '',
        contact_person: '',
        contact_phone: '',
        email: ''
    });

    useEffect(() => {
        if (company_data) { 
            set_form_data(company_data);
        }
    }, [company_data]);
    let formatDate = (date) => {
        if (!date) return ''
        let d = new Date(date)
        return `${d.getFullYear()}-${(`0${d.getMonth() + 1}`).slice(-2)}-${(`0${d.getDate()}`).slice(-2)}`
    }

    let handleChange = (e) => {
        let { name, value } = e.target;
        set_form_data(prev => ({ ...prev, [name]: value }));
    };

    let handleSubmit = async(e) => {
        e.preventDefault();
        let company_id = localStorage.getItem("company_id")
        let new_date = formatDate(form_data.date_of_reg);

        fetch(`http://127.0.0.1:8000/edit/company/${company_id}/`, {
            method :"PUT",
            headers: {
                "Content-Type":  "application/json"
            },
            body:JSON.stringify({
                "name": form_data.company_name,
                "registration_date": new_date,
                "registration_number": form_data.company_reg_number,
                "address_street": form_data.address_street,
                "address_city": form_data.address_city,
                "contact_person": form_data.contact_person,
                "phone": form_data.contact_phone,
                "email": form_data.email
            })
        })
        .then(response => response.json())
        .then(response=>{
            if(response.message = "Company updated successfully"){
                set_status({
                    success : true,
                    error: false
                })
                update_company(response.data)
            }
        })
        .catch(error=>{
            console.log(error);
            set_status({   
                    success : false,
                    error: true
            })
        })
        .finally(()=>{
            setTimeout(()=>{
                set_status({   
                    success : false,
                    error: false
            })  
            }, 3500)
        })
     
    };

    return (
        <div className={styles.module}>
            <div className={styles.module_container} style={{ width: "70%" }}>
                <div className={styles.module_content}>
                    <form onSubmit={handleSubmit}>
                        <div className={`${styles.w_100} ${styles.flex} ${styles.flex_row} ${styles.space_between}`}>
                            <div className={`${styles.w_45}`}>
                                <label>Company Name</label>
                                <div className={styles.form_group}>
                                    <input
                                        placeholder="Company Name"
                                        type="text"
                                        name="company_name"
                                        onChange={handleChange}
                                        value={form_data.company_name}
                                        className={`${styles.input_form} ${styles.input_success}`}
                                    />
                                </div>
                                <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}`}>
                                    <label className={styles.form_label}>Date of Registration</label>
                                    <label className={styles.form_label}>Registration Number</label>
                                </div>
                                <div className={`${styles.form_group} ${styles.space_between}`}>
                                    <input
                                        placeholder="Date of Registration"
                                        type="date"
                                        name="date_of_reg"
                                        onChange={handleChange}
                                        value={form_data.date_of_reg}
                                        className={`${styles.input_form} ${styles.input_success}`}
                                        style={{ width: "45%" }}
                                    />

                                    <input
                                        placeholder="Registration Number"
                                        type="text"
                                        name="company_reg_number"
                                        onChange={handleChange}
                                        value={form_data.company_reg_number}
                                        className={`${styles.input_form} ${styles.input_success}`}
                                        style={{ width: "45%" }}
                                    />
                                </div>
                                <label>Address</label>
                                <div className={styles.form_group}>
                                    <input
                                        placeholder="Address"
                                        type="text"
                                        name="address_street"
                                        onChange={handleChange}
                                        value={form_data.address_street}
                                        className={`${styles.input_form} ${styles.input_success}`}
                                    />
                                </div>
                                <label>City</label>
                                <div className={styles.form_group}>
                                    <input
                                        placeholder="City"
                                        type="text"
                                        name="address_city"
                                        onChange={handleChange}
                                        value={form_data.address_city}
                                        className={`${styles.input_form} ${styles.input_success}`}
                                    />
                                </div>
                            </div>
                            <div className={`${styles.w_45}`}>
                                <label>Contact Person</label>
                                <div className={styles.form_group}>
                                    <input
                                        placeholder="Contact Person"
                                        type="text"
                                        name="contact_person"
                                        onChange={handleChange}
                                        value={form_data.contact_person}
                                        className={`${styles.input_form} ${styles.input_success}`}
                                    />
                                </div>
                                <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}`}>
                                    <label className={styles.form_label}>Company Phone</label>
                                    <label className={styles.form_label}>Company Email</label>
                                </div>
                                <div className={`${styles.form_group} ${styles.space_between}`}>
                                    <input
                                        placeholder="Phone number"
                                        type="text"
                                        name="contact_phone"
                                        onChange={handleChange}
                                        value={form_data.contact_phone}
                                        className={`${styles.input_form} ${styles.input_success}`}
                                        style={{ width: "45%" }}
                                    />
                                    <input
                                        placeholder="Email"
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        value={form_data.email}
                                        className={`${styles.input_form} ${styles.input_success}`}
                                        style={{ width: "45%" }}
                                    />
                                </div>

                                { status.success && <div className='alert alert-success'>Company Update successfully</div>}
                                {status.error && <div className='alert alert-danger'>An Error Occured</div>}

                                <div className={styles.bttm_btns}>
                                    <button type="submit" className={`${styles.btn} ${styles.btn_primary}`}>
                                        Save
                                    </button>
                                    <button type="button" onClick={close_module} className={`${styles.btn} ${styles.btn_danger}`} style={{ marginLeft: "15px" }}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditCompanyModule;
