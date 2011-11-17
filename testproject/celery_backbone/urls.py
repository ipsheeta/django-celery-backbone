from django.conf.urls.defaults import patterns, include, url
from celery_backbone.views import task_status, task_list_json

urlpatterns = patterns('',
    url(r'^$', task_status, name='task_status'),
    url(r'^task_list.json$', task_list_json, name='task_list_json'),
)
