import logging

from django.shortcuts import get_object_or_404

from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import ProfileSerializer, SkillSerializer, EducationSerializer,ExperienceSerializer,ProjectSerializer

from .models import Profile,Skill,Education,Experience,Project
from .serializers import ProfileSerializer
from .permissions import IsProfileOwner,IsProfileResourceOwner


logger = logging.getLogger("proconnect")


class MyProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, created = Profile.objects.get_or_create(
            user=request.user
        )

        if created:
            logger.info(
                "Profile created automatically: user_id=%s",
                request.user.id
            )

        serializer = ProfileSerializer(profile)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def patch(self, request):
        profile, created = Profile.objects.get_or_create(
            user=request.user
        )

        serializer = ProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save()

        logger.info(
            "Profile updated: user_id=%s",
            request.user.id
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class PublicProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):

        profile = get_object_or_404(
            Profile.objects.select_related("user").prefetch_related(
                "skills",
                "education",
                "experience",
                "projects",
            ),
            user_id=user_id
        )

        serializer = ProfileSerializer(profile)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    








class SkillListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(
            user=request.user
        )

        skills = profile.skills.all()
        serializer = SkillSerializer(skills, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):
        serializer = SkillSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        profile, _ = Profile.objects.get_or_create(
            user=request.user
        )

        skill, created = Skill.objects.get_or_create(
            name=serializer.validated_data["name"].strip()
        )

        profile.skills.add(skill)

        logger.info(
            "Skill added: user_id=%s skill_id=%s",
            request.user.id,
            skill.id
        )

        return Response(
            SkillSerializer(skill).data,
            status=status.HTTP_201_CREATED
        )


class SkillDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, skill_id):
        profile, _ = Profile.objects.get_or_create(
            user=request.user
        )

        skill = get_object_or_404(
            Skill,
            id=skill_id
        )

        if not profile.skills.filter(id=skill.id).exists():
            return Response(
                {"detail": "Skill is not associated with your profile."},
                status=status.HTTP_404_NOT_FOUND
            )

        profile.skills.remove(skill)

        logger.info(
            "Skill removed: user_id=%s skill_id=%s",
            request.user.id,
            skill.id
        )

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )




class EducationListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EducationSerializer

    def get_queryset(self):
        return Education.objects.filter(
            profile__user=self.request.user
        ).select_related("profile")

    def perform_create(self, serializer):
        profile, _ = Profile.objects.get_or_create(
            user=self.request.user
        )

        education = serializer.save(profile=profile)

        logger.info(
            "Education created: user_id=%s education_id=%s",
            self.request.user.id,
            education.id
        )


class EducationDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Education.objects.select_related(
        "profile__user"
    )
    serializer_class = EducationSerializer
    permission_classes = [
        IsAuthenticated,
        IsProfileResourceOwner,
    ]

    def perform_update(self, serializer):
        education = serializer.save()

        logger.info(
            "Education updated: user_id=%s education_id=%s",
            self.request.user.id,
            education.id
        )

    def perform_destroy(self, instance):
        education_id = instance.id

        instance.delete()

        logger.info(
            "Education deleted: user_id=%s education_id=%s",
            self.request.user.id,
            education_id
        )



class ExperienceListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ExperienceSerializer

    def get_queryset(self):
        return Experience.objects.filter(
            profile__user=self.request.user
        ).select_related("profile")

    def perform_create(self, serializer):
        profile, _ = Profile.objects.get_or_create(
            user=self.request.user
        )

        experience = serializer.save(profile=profile)

        logger.info(
            "Experience created: user_id=%s experience_id=%s",
            self.request.user.id,
            experience.id
        )


class ExperienceDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Experience.objects.select_related(
        "profile__user"
    )
    serializer_class = ExperienceSerializer
    permission_classes = [
        IsAuthenticated,
        IsProfileResourceOwner,
    ]

    def perform_update(self, serializer):
        experience = serializer.save()

        logger.info(
            "Experience updated: user_id=%s experience_id=%s",
            self.request.user.id,
            experience.id
        )

    def perform_destroy(self, instance):
        experience_id = instance.id

        instance.delete()

        logger.info(
            "Experience deleted: user_id=%s experience_id=%s",
            self.request.user.id,
            experience_id
        )



class ProjectListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(
            profile__user=self.request.user
        ).select_related("profile")

    def perform_create(self, serializer):
        profile, _ = Profile.objects.get_or_create(
            user=self.request.user
        )

        project = serializer.save(profile=profile)

        logger.info(
            "Project created: user_id=%s project_id=%s",
            self.request.user.id,
            project.id
        )


class ProjectDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.select_related(
        "profile__user"
    )
    serializer_class = ProjectSerializer
    permission_classes = [
        IsAuthenticated,
        IsProfileResourceOwner,
    ]

    def perform_update(self, serializer):
        project = serializer.save()

        logger.info(
            "Project updated: user_id=%s project_id=%s",
            self.request.user.id,
            project.id
        )

    def perform_destroy(self, instance):
        project_id = instance.id

        instance.delete()

        logger.info(
            "Project deleted: user_id=%s project_id=%s",
            self.request.user.id,
            project_id
        )