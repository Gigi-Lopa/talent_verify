from django.urls import path
from . import views as vs 

urlpatterns = [
   path("login", vs.company_login),
   path("register", vs.register_company),
   path("add/emp", vs.add_employee),
   path("employees", vs.employee_list),
   path('employees/batch-upload/', vs.upload_employees_file),
   path('company', vs.get_company_profile),
   path('employee/<str:employee_id>/', vs.get_employee_profile),
   path('employee/delete/<str:employee_id>/', vs.delete_employee),
   path('edit/company/<str:company_id>/', vs.edit_company),  
   path('employees/search', vs.search_employee),
] 
