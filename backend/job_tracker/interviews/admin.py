from django.contrib import admin
from .models import Interview


@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = (
        'application', 'interview_date', 'interview_time', 'interview_type',
        'status',
    )
    list_filter = ('interview_type', 'status')
    search_fields = (
        'application__company_name', 'application__job_title', 'interviewer',
    )
    readonly_fields = ('created_at', 'updated_at')
