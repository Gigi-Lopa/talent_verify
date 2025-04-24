from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
import pandas as pd
from django.db.models import Q
from django.http import JsonResponse
from .models import Company, Department, Employee
from .serializers import CompanyLoginSerializer, CompanyRegisterSerializer, EmployeeSerializer, DepartmentSerializer, GetEmployeeSerializer, CompanyEditSerializer

@api_view(['POST'])
def company_login(request):
    serializer = CompanyLoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        try:
            company = Company.objects.get(email=email)
            if company.check_password(password):
                return Response({
                    "status": "success",
                    "company_id": company.id,
                    "name": company.name,
                    "email": company.email
                })
            else:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        except Company.DoesNotExist:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register_company(request):
    serializer = CompanyRegisterSerializer(data=request.data)
    if serializer.is_valid():
        company_ = serializer.save()
        company_id = company_.id
        company_name = company_.name

        departments = request.data.get('departments')

        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            print("Company Not found")

        for name in departments:
            if not Department.objects.filter(name=name, company=company).exists():
                dept = Department.objects.create(name=name, company=company)
    
        return Response({
            "status": "success",
            "company_id": company_id,
            "name" : company_name
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def add_employee(request):
    serializer = EmployeeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Employee added successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def update_employee(request):
    pass


@api_view(['GET'])
def employee_list(request):
    company = request.GET.get("com")
    page = request.GET.get('page', 1)
    page_size = request.GET.get('page_size', 10)

    employees = Employee.objects.filter(company=company).order_by("id").reverse()
    departments = Department.objects.filter(company=company)


    paginator = PageNumberPagination()
    paginator.page_size = page_size
    paginated_employees = paginator.paginate_queryset(employees, request)

    serialized_employees = EmployeeSerializer(paginated_employees, many=True)
    serialized_departments = DepartmentSerializer(departments, many=True)

    return paginator.get_paginated_response({
        'employees': serialized_employees.data,
        'departments': serialized_departments.data
    })

@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_employees_file(request):
    file = request.FILES.get('file')
    company_id = request.data.get('company_id')

    if not file or not company_id:
        return Response({'error': 'File and company_id are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        df = pd.read_csv(file)
    except Exception as e:
        return Response({'error': f'Invalid file format: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    required_fields = {'name', 'employee_id', 'department', 'role', 'start_date', 'end_date', 'duties'}
    if not required_fields.issubset(df.columns):
        return Response({'error': f'Missing fields: {required_fields - set(df.columns)}'}, status=status.HTTP_400_BAD_REQUEST)

    company = Company.objects.get(id=company_id)
    created, failed = [], []

    for _, row in df.iterrows():
        data = row.to_dict()
        data['company'] = company.id
        serializer = EmployeeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            created.append(data['name'])
        else:
            failed.append({'data': data, 'errors': serializer.errors})

    return Response({
        'successfully_created': created,
        'failed_entries': failed
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_company_profile(request):
    try:
        company_id = request.GET.get("com")
        company = Company.objects.get(id=company_id)
        departments = Department.objects.filter(company=company_id)
        employees = Employee.objects.filter(company = company_id).count()

        departments_ = []
        for dep in departments:
            dep_map = {}
            dep_map[dep.company.id] = dep.name
            departments_.append(dep_map)
            
        return JsonResponse({
            "company_name": company.name,
            "date_of_reg": company.registration_date,
            "company_reg_number": company.registration_number,
            "address_street": company.address_street,
            "address_city": company.address_city,
            "number_of_employees": employees,
            "contact_person" :company.contact_person,
            "contact_phone": company.phone,
            "email": company.email,
            "departments" : departments_
        }, status=200)
    except Company.DoesNotExist:
        return JsonResponse({"error": "Company not found"}, status=404)

@api_view(['GET'])
def get_employee_profile(request, employee_id):
    try:
        employee = Employee.objects.get(employee_id=employee_id)
        serializer = GetEmployeeSerializer(employee)
        department = Department.objects.get(id = serializer.data['department'])
        data = serializer.data
        data['department'] = str(department).split("-")[0]
        data['company'] = str(department).split("-")[1]
        
        return Response(data, status=status.HTTP_200_OK)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_employee(request, employee_id):
    try:
        employee = Employee.objects.get(employee_id=employee_id)
        employee.delete()
        return Response({'message': 'Employee deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def edit_company(request, company_id):
    try:
        company = Company.objects.get(id=company_id)
    except Company.DoesNotExist:
        return Response({'error': 'Company not found'}, status=404)

    serializer = CompanyEditSerializer(company, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Company updated successfully', 'data': serializer.data})
    return Response(serializer.errors, status=400)


@api_view(['GET'])
def search_employee(request):
    query = request.GET.get('q', '')
    if not query:
        return Response({'error': 'Search query is required.'}, status=400)

    employees = Employee.objects.filter(
        Q(name__icontains=query) |
        Q(employee_id__icontains=query)
    )[:5] 

    serializer = EmployeeSerializer(employees, many=True)
    return Response({'results': serializer.data})