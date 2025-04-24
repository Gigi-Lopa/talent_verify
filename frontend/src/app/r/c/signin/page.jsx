"use client"
import React  from 'react';
import { createContext, useState } from 'react';
import styles from "@/app/styles/main.module.css"
import { Formik } from "formik";
import "bootstrap/dist/css/bootstrap.css"

export default function EmployerLogin() {
  let [invalid_acc, set_invalid_acc] = useState(false);
  let handle_login = async(values) => {
    fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response.status === 200 || response.status === "success") {
        set_invalid_acc(false);
        localStorage.clear();
        localStorage.setItem("company_name", response.name);
        localStorage.setItem("company_id", response.company_id);
        location.href = "/";
      } else {
        set_invalid_acc(true);
        setTimeout(() => { set_invalid_acc(false) }, 3500);
      }
    })
    .catch(error => {
      console.log(error);
      set_invalid_acc(true);
      setTimeout(() => { set_invalid_acc(false) }, 3500);
    });
  }
  
  return (
    <div className={styles.auth_land}>
      <div className={styles.auth_container}>
        <Formik
          initialValues={{ email: '', password: '' }}
          validate={values => {
            const errors = {};
            if (!values.email) {
              errors.email =  true
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
              errors.email = true;
            }

            if (!values.password) {
              errors.password = true;
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              handle_login(values)
              setSubmitting(false);
            }}
        >
          {({
            values,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} style={{width :"20%"}}>
              <h3 className={styles.form_header}>Sign In</h3>
              <div className={styles.form_group}>
                  <input
                  placeholder = "Email"
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  className={`${styles.input_form} ${errors.email ? styles.input_error : styles.input_success}`}
                />
              </div>
            
              <div className={styles.form_group}>
                <input
                  placeholder = "Password"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className={`${styles.input_form} ${errors.password ? styles.input_error : styles.input_success}`}
                />              
              </div>
              {
                invalid_acc ?
                  <div className='alert alert-danger' role={"alert"}>
                    Invalid Account
                  </div> :<></>
              }
          
              <div className={`flex flex-col`} style={{paddingTop : "0px"}}>            
                <button type="submit" className={`${styles.btn} ${styles.btn_primary} ${styles.btn_wd}`}  disabled={isSubmitting}>
                  Submit
                </button>
                <p style={{margin:"unset", textAlign : "center",fontSize : '0.9rem', paddingTop: "10px"}}>Don't have an account? <a href={"/r/c/signup"} className={`${styles.a_tag}`}>Create account</a></p>
                </div>
              </form>
          )}
        </Formik>
      </div>
    </div>   
  );
}
