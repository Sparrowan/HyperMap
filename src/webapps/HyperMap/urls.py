from django.conf.urls import url
from django.contrib.auth.views import logout_then_login
from django.contrib import admin
from HyperMap import views

from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    #url(r'^', views.home, name='home'),
    url(r'^$', views.home, name='home'),
    url(r'^admin/', admin.site.urls),
    url(r'^error/$', views.react_render),
    url(r'^main/$', views.react_render),
    url(r'^logout/$', logout_then_login),
    url(r'^register/$', views.register),
    url(r'^confirm_registration/(?P<id>\d+)/(?P<token>\w+-\w+)$', views.confirm_registration, name='confirm_registration'),
    url(r'^test/$', views.react_render),
    url(r'^profile/$', views.react_render),
    url(r'^grouplist/$', views.react_render),
    url(r'^login/$', views.user_login),
    url(r'^get_all_user/$', views.get_all_user),
    url(r'^get_all_events/$', views.get_all_events),
    url(r'^get_user_events/$', views.get_user_events),
    url(r'^get_user_info/$', views.get_user_info),
    url(r'^get_user_profile/$', views.get_user_profile),
    url(r'^footprint/$', views.react_render),
    url(r'^get_footprint/$', views.get_footprint),
    url(r'^confirm_event/$', views.confirm_event),
    url(r'^delete_event/$', views.delete_event),
    url(r'^withdraw_group/$', views.withdraw_group),
    url(r'^all_events/$', views.react_render),
    url(r'^edit_profile/$', views.react_render),
    url(r'^edit_profile_api/$', views.edit_profile),
    url(r'^create_event/$', views.create_event),
    url(r'^get_filtered_events/$', views.get_filtered_events),
    url(r'^get_event/$', views.get_event),
    url(r'^get_registered_users/$', views.get_registered_users),
    url(r'^register_event/$', views.register_event),
    url(r'^create_group/$', views.create_group),
    url(r'^get_groups/$', views.get_groups),
    url(r'^get_group_users/$', views.get_group_users),
    url(r'^get_recommendation_events/$', views.get_recommendation_events),
    url(r'^edit_event/$', views.edit_event),
    url(r'^.*/$',views.error404),
    #url(r'^obtain-auth-token/$', views.user_login),#obtain_auth_token),
]
