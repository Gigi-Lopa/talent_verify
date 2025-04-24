"use client"
import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.css"
import styles from "@/app/styles/main.module.css"
import "@/app/styles/bootstrap-icons/bootstrap-icons.css"

export default function Nav({active }) {
  let [search_value, set_search_value] = useState('');
  let [results, set_results] = useState([]);

  let on_search =()=>{
    if(search_value && search_value.length >= 2 ){
      fetch(`http://127.0.0.1:8000/employees/search?q=${search_value}`)
      .then(response=>response.json())
      .then(response=>set_results(response.results))
    }
 
  }

  return (
    <div>
      <div className={styles.nav_bar}>
        <div className='container'>
          <div className={`${styles.flex} ${styles.flex_row} ${styles.space_between}`}>
            <div className='col'>
              <h4>Talent Verify</h4>
            </div>
            <div className='col'>
              <nav>
                <ul>                  
                  <li className={`${styles.nav_link}  ${active.isEmployee ? styles.nav_link_active : ''}`}>
                    <a href='/'>Employees</a>
                  </li>
                  <li className={`${styles.nav_link} ${active.isProfile ? styles.nav_link_active : ''}`}><a href='/r/c/profile/company'>Profile</a></li>
                </ul>
              </nav>
            </div>
            <div className='col' style={{position:"relative"}}>
              <div className={`${styles.searchbar} ${styles.flex} ${styles.flex_row}`}>
                <input placeholder = {"Search Name Or Emp ID"}name='search' value={search_value} onChange={e=>{set_search_value(e.target.value); on_search()}} className={styles.search_input}/>
                <button className={styles.search_btn}><span className='bi bi-search'></span></button>
              </div>  
              { 
                results.length != 0 && search_value.length >= 2 ? (<>
                <div className={styles.search_results}>
                <div className={styles.results}>
                {
                      results.map(emp=>(
                        <div className={styles.result}>
                        <span className='bi bi-person-fill'></span>
                        <a href={`/r/c/profile/emp?id=${emp.employee_id}`}>{emp.name}</a>
                      </div>
                      ))
                    }
                </div>
              </div>
                </>) : (<></>)
              }
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
