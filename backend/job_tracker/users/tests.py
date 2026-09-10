from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from applications.models import JobApplication


class AuthenticationAndOwnershipTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            username='owner@example.com',
            email='owner@example.com',
            password='test-password-123',
        )
        self.other_user = User.objects.create_user(
            username='other@example.com',
            email='other@example.com',
            password='test-password-123',
        )
        self.application = JobApplication.objects.create(
            user=self.other_user,
            company_name='Private Company',
            job_title='Private Role',
            job_type=JobApplication.JobType.FULL_TIME,
            applied_date='2020-01-01',
        )

    def test_registration_creates_profile(self):
        response = self.client.post('/api/auth/register/', {
            'name': 'New User',
            'email': 'new@example.com',
            'password': 'test-password-123',
            'confirm_password': 'test-password-123',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.get(email='new@example.com').profile)

    def test_user_cannot_retrieve_another_users_application(self):
        self.client.force_authenticate(user=self.owner)
        response = self.client.get(f'/api/applications/{self.application.id}/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
