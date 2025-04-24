"use client"
import React, { useState } from 'react';
import styles from "@/app/styles/main.module.css";
import "bootstrap/dist/css/bootstrap.css";
import "@/app/styles/bootstrap-icons/bootstrap-icons.css";

export default function EmployerCreateAccount() {
    const [departments, set_departments] = useState([]);
    const [current_department, set_current] = useState('');
    const [error, set_error] = useState(false);
    const [formData, setFormData] = useState({
        company_name: '',
        date_of_reg: '',
        company_reg_number: '',
        address_street: '',
        address_city: '',
        number_of_employees: '',
        contact_person: '',
        contact_phone: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return `${d.getFullYear()}-${(`0${d.getMonth() + 1}`).slice(-2)}-${(`0${d.getDate()}`).slice(-2)}`;
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const validateForm = () => {
        const formErrors = {};
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        Object.entries(formData).forEach(([key, value]) => {
            if (!value) formErrors[key] = true;
        });

        if (!emailRegex.test(formData.email)) formErrors.email = true;
        if (formData.password !== formData.confirmPassword) {
            formErrors.password = true;
            formErrors.confirmPassword = true;
        }

        setFormErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = {
            name: formData.company_name,
            registration_number: formData.company_reg_number,
            registration_date: formatDate(formData.date_of_reg),
            address_street: formData.address_street,
            address_city: formData.address_city,
            contact_person: formData.contact_person,
            phone: formData.contact_phone,
            email: formData.email,
            password: formData.password,
            departments: departments
        };

        fetch("http://127.0.0.1:8000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(response => {
            if (response.status === "success" && response.company_id != null) {
                set_error(false);
                localStorage.clear();
                localStorage.setItem("company_name", response.name);
                localStorage.setItem("company_id", response.company_id);
                location.href = "/";
            } else {
                set_error(true);
                setTimeout(() => set_error(false), 3500);
            }
        })
        .catch(() => {
            set_error(true);
            setTimeout(() => set_error(false), 3500);
        });
    };
    return (
        <div className={styles.auth_land} style={{ height: "fit-content" }}>
            <div className={styles.auth_container}>
                <form onSubmit={handleSubmit} className={styles.sign_up_form}>
                    <h3 className={styles.form_header}>Sign Up</h3>

                    <div className={styles.form_group}>
                        <input
                            placeholder="Company Name"
                            type="text"
                            name="company_name"
                            onChange={handleInputChange}
                            value={formData.company_name}
                            className={`${styles.input_form} ${formErrors.company_name ? styles.input_error : styles.input_success}`}
                        />
                    </div>
                    <label className={styles.form_label}>Date of Registration</label>
                    <div className={`${styles.form_group} ${styles.space_between}`}>
                            <input
                                placeholder = "Date of Registration"
                                type="date"
                                name="date_of_reg"
                                onChange={handleInputChange}  
                                value={formData.date_of_reg}
                                className={`${styles.input_form} ${formErrors.date_of_reg ? styles.input_error : styles.input_success}`}
                                style={{ width : "45%"}}
                        />
                        <input
                            placeholder = "Registration Number"
                            type="text"
                            name="company_reg_number"
                            onChange={handleInputChange}
                            value={formData.company_reg_number}
                            className={`${styles.input_form} ${formErrors.company_reg_number ? styles.input_error : styles.input_success}`}
                            style={{ width : "45%"}}
                    />
                    </div>
                    <div className={styles.form_group}>
                        <input
                            placeholder = "Address"
                            type="text"
                            name="address_street"
                            onChange={handleInputChange}
                            value={formData.address_street}
                            className={`${styles.input_form} ${formErrors.address_street ? styles.input_error : styles.input_success}`}
                        />
                    </div>
                    <div className={styles.form_group}>
                        <input
                            placeholder = "City"
                            type="text"
                            name="address_city"
                            onChange={handleInputChange}  
                            value={formData.address_city}
                            className={`${styles.input_form} ${formErrors.address_city ? styles.input_error : styles.input_success}`}
                        />
                    </div>
                    <div className={`${styles.form_group} ${styles.space_between}`}>
                        <input
                            placeholder = "List Departments"
                            type="text"
                            name="list_of_departments"
                            onChange={(e)=>{set_current(e.target.value)}}
                            value={current_department}
                            className={`${styles.input_form} ${styles.input_success} ${styles.w_90}`}
                        />
                        <button type={"button"} className={`${styles.btn} ${styles.btn_primary}`} style={{height:"fit-content", marginTop : "3px"}} onClick={()=>{
                           if(current_department.length >= 3 && !departments.includes(current_department.trim())) {
                                set_departments(prev => [...prev, current_department.trim()])
                                set_current('');
                            }
                        }}>
                            <span className='bi bi-check-lg'></span>
                        </button>
                    </div>
                    {   departments.length != 0 ?
                        <div className={styles.departments}>
                        {
                            departments.map((department, index)=>{
                                return (
                                    <div className= {styles.department} key={index}>
                                        <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}`}>
                                            <>{department}</>
                                            <span className='bi bi-x' onClick={()=>{
                                                set_departments(prev => prev.filter(item => item !== department));
                                            }}></span>
                                        </div>  
                                    </div>
                                )
                            })
                        }
                        </div>:<></>
                    }
                    <div className={styles.form_group}>
                        <input
                            placeholder = "Number of Employees"
                            type="text"
                            name="number_of_employees"
                            onChange={handleInputChange}
                            
                            value={formData.number_of_employees}
                            className={`${styles.input_form} ${formErrors.number_of_employees ? styles.input_error : styles.input_success}`}
                        />
                    </div>
                    <div className={styles.form_group}>
                        <input
                            placeholder = "Contact Person"
                            type="text"
                            name="contact_person"
                            onChange={handleInputChange}
                            
                            value={formData.contact_person}
                            className={`${styles.input_form} ${formErrors.contact_person ? styles.input_error : styles.input_success}`}
                        />
                    </div>
                    <div className={`${styles.form_group} ${styles.space_between}`}>
                        <input
                            placeholder = "Phone number"
                            type="text"
                            name="contact_phone"
                            onChange={handleInputChange}
                            
                            value={formData.contact_phone}
                            className={`${styles.input_form} ${formErrors.contact_phone ? styles.input_error : styles.input_success}`}
                            style={{width : "45%"}}
                    />
                        <input
                            placeholder = "Email"
                            type="email"
                            name="email"
                            onChange={handleInputChange}
                            
                            value={formData.email}
                            className={`${styles.input_form} ${formErrors.email ? styles.input_error : styles.input_success}`}
                            style={{width : "45%"}}
                    />
                    </div>
                    <div className={styles.form_group}>
                        <input
                            placeholder = "Password"
                            type="password"
                            name="password"
                            onChange={handleInputChange}
                            
                            value={formData.password}
                            className={`${styles.input_form} ${formErrors.password ? styles.input_error : styles.input_success}`}
                        />              
                    </div>
                    <div className={styles.form_group}>
                        <input
                            placeholder = "Confirm Password"
                            type="password"
                            name="confirmPassword"
                            onChange={handleInputChange}
                            
                            value={formData.confirmPassword}
                            className={`${styles.input_form} ${formErrors.confirmPassword ? styles.input_error : styles.input_success}`}
                        />              
                    </div>
                    {
                        error ? 
                        <div className="alert alert-danger" role='alert'>
                            Failed to register {formData.company_name}
                        </div> :<></>
                    }
                    <div className={`flex flex-col`} style={{paddingTop : "15px"}}>            
                        <button type={"submit"} className={`${styles.btn} ${styles.btn_primary} ${styles.btn_wd}`} disabled = {false}>
                            Submit
                        </button>
                        <p style={{margin:"unset", textAlign : "center",fontSize : '0.9rem', paddingTop: "10px"}}>Already have an account? <a href={"/r/c/signin"} className={`${styles.a_tag}`}>Sign In</a></p>
                    </div>
                </form>
        </div>
    </div>
  );
}
