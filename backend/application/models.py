from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class Company(models.Model):
    name = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=100)
    registration_date = models.DateField()
    address_street = models.TextField()
    address_city = models.TextField()
    contact_person = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    
    def set_password(self, raw_password):        
        self.password = make_password(raw_password)
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    def __str__(self):
        return self.name

class Department(models.Model):
    name = models.CharField(max_length=100)
    company = models.ForeignKey(Company, related_name='departments', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} - {self.company.name}"

class Employee(models.Model):
    name = models.CharField(max_length=100)
    employee_id = models.CharField(max_length=50, blank=True, null=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    role = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    duties = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.employee_id})"


class UploadedFile(models.Model):
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

