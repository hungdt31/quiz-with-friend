from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

api_patterns = [
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    path('', include('api.v1.urls')),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/<str:version>/', include(api_patterns)),
]
