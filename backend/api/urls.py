from django.urls import path
from . import views

urlpatterns = [
    path('', views.health_check, name='health_check'),
    path('ipos/', views.list_ipos, name='list_ipos'),
    path('ipo/<str:key>/', views.get_ipo_analysis, name='get_ipo_analysis'),
    path('analyze/', views.analyze_custom_ipo, name='analyze_custom_ipo'),
]
