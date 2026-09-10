from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class JobApplication(models.Model):
    class Status(models.TextChoices):
        APPLIED = 'applied', 'Applied'
        SHORTLISTED = 'shortlisted', 'Shortlisted'
        INTERVIEW = 'interview', 'Interview'
        SELECTED = 'selected', 'Selected'
        REJECTED = 'rejected', 'Rejected'

    class JobType(models.TextChoices):
        FULL_TIME = 'full_time', 'Full Time'
        PART_TIME = 'part_time', 'Part Time'
        INTERNSHIP = 'internship', 'Internship'
        CONTRACT = 'contract', 'Contract'

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='job_applications'
    )
    company_name = models.CharField(max_length=150)
    job_title = models.CharField(max_length=150)
    job_location = models.CharField(max_length=150, blank=True)
    job_type = models.CharField(max_length=20, choices=JobType.choices)
    job_url = models.URLField(blank=True)
    applied_date = models.DateField()
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.APPLIED
    )
    salary = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True,
        validators=[MinValueValidator(0)],
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_date', '-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['user', 'job_type']),
        ]

    def __str__(self):
        return f'{self.company_name} - {self.job_title}'
