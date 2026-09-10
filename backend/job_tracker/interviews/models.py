from django.db import models
from applications.models import JobApplication


class Interview(models.Model):
    class InterviewType(models.TextChoices):
        TECHNICAL = 'technical', 'Technical'
        HR = 'hr', 'HR'
        APTITUDE = 'aptitude', 'Aptitude'
        MANAGERIAL = 'managerial', 'Managerial'
        OTHER = 'other', 'Other'

    class Status(models.TextChoices):
        SCHEDULED = 'scheduled', 'Scheduled'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    application = models.ForeignKey(
        JobApplication, on_delete=models.CASCADE, related_name='interviews'
    )
    interview_date = models.DateField()
    interview_time = models.TimeField()
    interview_type = models.CharField(max_length=20, choices=InterviewType.choices)
    interviewer = models.CharField(max_length=150, blank=True)
    meeting_link = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.SCHEDULED
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['interview_date', 'interview_time']
        indexes = [
            models.Index(fields=['interview_date', 'status']),
        ]

    def __str__(self):
        return f'{self.application} on {self.interview_date}'
