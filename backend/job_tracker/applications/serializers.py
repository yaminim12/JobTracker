from datetime import date

from rest_framework import serializers

from .models import JobApplication


class JobApplicationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = JobApplication
        fields = (
            'id', 'user', 'company_name', 'job_title', 'job_location', 'job_type',
            'job_url', 'applied_date', 'status', 'salary', 'notes', 'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

    def validate_applied_date(self, value):
        if value > date.today():
            raise serializers.ValidationError('Applied date cannot be in the future.')
        return value
