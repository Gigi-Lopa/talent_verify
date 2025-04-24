# Talent Verify

**Talent Verify** is a cloud-based employee and company data verification system. It provides version control, encryption, bulk uploads, search functionality, and more.

---

## 🚀 Features

- Company & Employee management
- Bulk employee CSV/XLSX upload
- Encrypted and version-controlled records
- Employee search (by name or ID)

---
## 📝 CSV Structure for Bulk Employee Upload

PLEASE NOTE: An example of the csv in the root folder of the project
If you open the CSV FILE with Excel the date format changes. I argue you to use VS Code or any other Code IDE
When uploading a CSV/XLSX file, the structure must follow the format below:

```csv
name,employee_id,department,role,start_date,end_date,duties
John Doe,12345,Accounting,Manager,2023-01-01,2024-01-01,Oversees accounting team
Jane Smith,67890,IT,Developer,2022-06-15,2023-12-31,Develops internal tools

---

## Admin Access

``` Link
http://localhost:8000/admin

``` Credentials
USERNAME: gilbert
PASSWORD: 123

## Dependencies

``` Frontend
CD into the frontend DIR and run npm install on the terminal 
To run the frontend use -> npm run dev


``` Backend 
Create virtaul Env first then run pip install -r requirements.txt
To run the backend use -> python manage.py runserver
