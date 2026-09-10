from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from interviews.models import Interview
from interviews.serializers import InterviewSerializer

from .models import JobApplication
from .serializers import JobApplicationSerializer


class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = JobApplication.objects.filter(user=self.request.user)
        search = self.request.query_params.get('search', '').strip()
        status = self.request.query_params.get('status')
        job_type = self.request.query_params.get('job_type')
        ordering = self.request.query_params.get('ordering', '-applied_date')
        allowed_ordering = {
            'applied_date', '-applied_date', 'company_name', '-company_name',
            'job_title', '-job_title', 'created_at', '-created_at',
        }

        if search:
            queryset = queryset.filter(
                Q(company_name__icontains=search)
                | Q(job_title__icontains=search)
            )
        if status:
            queryset = queryset.filter(status=status)
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        if ordering in allowed_ordering:
            queryset = queryset.order_by(ordering)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        applications = JobApplication.objects.filter(user=request.user)
        counts = {
            item['status']: item['total']
            for item in applications.values('status').annotate(total=Count('id'))
        }
        upcoming = Interview.objects.filter(
            application__user=request.user,
            status=Interview.Status.SCHEDULED,
            interview_date__gte=timezone.localdate(),
        )
        return Response({
            'statistics': {
                'total_applications': applications.count(),
                'applied': counts.get(JobApplication.Status.APPLIED, 0),
                'shortlisted': counts.get(JobApplication.Status.SHORTLISTED, 0),
                'interview': counts.get(JobApplication.Status.INTERVIEW, 0),
                'selected': counts.get(JobApplication.Status.SELECTED, 0),
                'rejected': counts.get(JobApplication.Status.REJECTED, 0),
            },
            'recent_applications': JobApplicationSerializer(
                applications.order_by('-created_at')[:5], many=True
            ).data,
            'upcoming_interviews': InterviewSerializer(
                upcoming.order_by('interview_date', 'interview_time')[:5],
                many=True,
                context={'request': request},
            ).data,
        })
