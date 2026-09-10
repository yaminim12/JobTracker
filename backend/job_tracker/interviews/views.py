from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Interview
from .serializers import InterviewSerializer


class InterviewViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Interview.objects.filter(application__user=self.request.user)
        application_id = self.request.query_params.get('application')
        status = self.request.query_params.get('status')

        if application_id:
            queryset = queryset.filter(application_id=application_id)
        if status:
            queryset = queryset.filter(status=status)
        return queryset

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        queryset = self.get_queryset().filter(
            status=Interview.Status.SCHEDULED,
            interview_date__gte=timezone.localdate(),
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
