


from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),

    path(
        "api/auth/",
        include("accounts.urls"),
    ),

    path(
        "api/profiles/",
        include("profiles.urls"),),

    path(
        "api/posts/",
        include("posts.urls"),
    ),

    path(
        "api/networking/",
        include("networking.urls"),
    ),

    path(
        "api/messaging/",
        include("messaging.urls"),
    ),
]