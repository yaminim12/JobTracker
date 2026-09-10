from rest_framework import serializers

from applications.models import JobApplication

from .models import Interview


class InterviewSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(
        source='application.company_name', read_only=True
    )
    job_title = serializers.CharField(source='application.job_title', read_only=True)

    class Meta:
        model = Interview
        fields = (
            'id', 'application', 'company_name', 'job_title', 'interview_date',
            'interview_time', 'interview_type', 'interviewer', 'meeting_link',
            'notes', 'status', 'created_at', 'updated_at',
        )
        read_only_fields = (
            'id', 'company_name', 'job_title', 'created_at', 'updated_at',
        )

    def validate_application(self, application):
        request = self.context['request']
        if application.user_id != request.user.id:
            raise serializers.ValidationError(
                'You can only schedule interviews for your own applications.'
            )
        return application
