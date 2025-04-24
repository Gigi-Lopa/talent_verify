from rest_framework import serializers
from .models import Company, Employee, Department

class CompanyLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class CompanyRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            'name', 'registration_number', 'registration_date',
            'address_street','address_city', 'contact_person', 'phone', 'email', 'password'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        company = Company(**validated_data)
        company.set_password(password)
        company.save()
        return company

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['name', 'employee_id', 'department', 'company', 'role', 'start_date', 'end_date','duties']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']

class GetEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

from rest_framework import serializers
from .models import Company
from django.contrib.auth.hashers import make_password

class CompanyEditSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Company
        fields = [
            'name', 'registration_number', 'registration_date',
            'address_street','address_city', 'contact_person', 'phone', 'email', 'password'
        ]

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.password = make_password(password)

        instance.save()
        return instance