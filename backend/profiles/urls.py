from django.urls import path

from .views import (
    MyProfileView,
    PublicProfileView,
    SkillListCreateView,
    SkillDeleteView,
    EducationListCreateView,
    EducationDetailView,
    ExperienceListCreateView,
    ExperienceDetailView,
    ProjectListCreateView,
    ProjectDetailView

)


urlpatterns = [
    path(
        "me/",
        MyProfileView.as_view(),
        name="my-profile"
    ),

    path(
        "<int:user_id>/",
        PublicProfileView.as_view(),
        name="public-profile"
    ),
    path("skills/", SkillListCreateView.as_view(), name="skill-list-create"),
    path(
        "skills/<int:skill_id>/",
        SkillDeleteView.as_view(),
        name="skill-delete"
    ),

    path(
        "education/",
        EducationListCreateView.as_view(),
        name="education-list-create"
    ),
    path(
        "education/<int:pk>/",
        EducationDetailView.as_view(),
        name="education-detail"
    ),

    path(
        "<int:user_id>/",
        PublicProfileView.as_view(),
        name="public-profile"
    ),
    path(
    "experience/",
    ExperienceListCreateView.as_view(),
    name="experience-list-create"
),
path(
    "experience/<int:pk>/",
    ExperienceDetailView.as_view(),
    name="experience-detail"
),
path(
    "projects/",
    ProjectListCreateView.as_view(),
    name="project-list-create"
),
path(
    "projects/<int:pk>/",
    ProjectDetailView.as_view(),
    name="project-detail"
),
]