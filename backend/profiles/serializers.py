from rest_framework import serializers

from .models import (
    Profile,
    Skill,
    Education,
    Experience,
    Project,
)


class SkillSerializer(serializers.ModelSerializer):

    class Meta:
        model = Skill
        fields = ["id", "name"]


class EducationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Education
        fields = [
            "id",
            "institution",
            "degree",
            "field_of_study",
            "start_date",
            "end_date",
            "description",
        ]

    def validate(self, data):
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if end_date and end_date < start_date:
            raise serializers.ValidationError(
                "End date cannot be before start date."
            )

        return data


class ExperienceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Experience
        fields = [
            "id",
            "company",
            "title",
            "employment_type",
            "location",
            "start_date",
            "end_date",
            "is_current",
            "description",
        ]

    def validate(self, data):
        start_date = data.get("start_date")
        end_date = data.get("end_date")
        is_current = data.get("is_current", False)

        if end_date and end_date < start_date:
            raise serializers.ValidationError(
                "End date cannot be before start date."
            )

        if is_current and end_date:
            raise serializers.ValidationError(
                "Current experience should not have an end date."
            )

        return data


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
            "technologies",
            "project_url",
            "github_url",
            "start_date",
            "end_date",
        ]

    def validate(self, data):
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError(
                "End date cannot be before start date."
            )

        return data


class ProfileSerializer(serializers.ModelSerializer):

    skills = SkillSerializer(many=True, read_only=True)
    education = EducationSerializer(
        many=True,
        read_only=True
    )
    experience = ExperienceSerializer(
        many=True,
        read_only=True
    )
    projects = ProjectSerializer(
        many=True,
        read_only=True
    )
    def validate_headline(self, value):
        if len(value.strip()) < 3 and value.strip():
            raise serializers.ValidationError(
                "Headline must contain at least 3 characters."
            )

        return value


    def validate_about(self, value):
        if len(value) > 2000:
            raise serializers.ValidationError(
                "About cannot exceed 2000 characters."
            )

        return value
    class Meta:
        model = Profile
        fields = [
            "id",
            "user",
            "profile_photo",
            "cover_image",
            "headline",
            "location",
            "about",
            "skills",
            "education",
            "experience",
            "projects",
        ]

        read_only_fields = ["id", "user"]