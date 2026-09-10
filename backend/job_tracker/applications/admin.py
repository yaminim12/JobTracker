from django.contrib import admin
from .models import JobApplication


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'job_title', 'user', 'status', 'applied_date')
    list_filter = ('status', 'job_type')
    search_fields = ('company_name', 'job_title', 'user__email')
    readonly_fields = ('created_at', 'updated_at')
