from django.contrib.auth.models import User
from django.db import models


class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    profile_photo = models.ImageField(
        upload_to="profile/photos/",
        blank=True,
        null=True
    )

    cover_image = models.ImageField(
        upload_to="profile/covers/",
        blank=True,
        null=True
    )

    headline = models.CharField(
        max_length=200,
        blank=True
    )

    location = models.CharField(
        max_length=150,
        blank=True
    )

    about = models.TextField(
        blank=True
    )

    skills = models.ManyToManyField(
        Skill,
        blank=True,
        related_name="profiles"
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"



class Education(models.Model):
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name="education"
    )

    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=150)
    field_of_study = models.CharField(max_length=150, blank=True)

    start_date = models.DateField()
    end_date = models.DateField(
        blank=True,
        null=True
    )

    description = models.TextField(
        blank=True
    )

    def __str__(self):
        return f"{self.degree} - {self.institution}"


class Experience(models.Model):
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name="experience"
    )

    company = models.CharField(max_length=200)
    title = models.CharField(max_length=150)

    employment_type = models.CharField(
        max_length=100,
        blank=True
    )

    location = models.CharField(
        max_length=150,
        blank=True
    )

    start_date = models.DateField()
    end_date = models.DateField(
        blank=True,
        null=True
    )

    is_current = models.BooleanField(
        default=False
    )

    description = models.TextField(
        blank=True
    )

    def __str__(self):
        return f"{self.title} - {self.company}"


class Project(models.Model):
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name="projects"
    )

    title = models.CharField(max_length=200)

    description = models.TextField(
        blank=True
    )

    technologies = models.CharField(
        max_length=500,
        blank=True
    )

    project_url = models.URLField(
        blank=True
    )

    github_url = models.URLField(
        blank=True
    )

    start_date = models.DateField(
        blank=True,
        null=True
    )

    end_date = models.DateField(
        blank=True,
        null=True
    )

    def __str__(self):
        return self.title