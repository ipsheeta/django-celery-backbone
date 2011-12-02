from django.conf.urls.defaults import patterns, include, url
from celery_backbone.views import task_status, task_list_json, TestPage
from celery_backbone.tasks import add as add_task

urlpatterns = patterns('',
    url(r'^$', task_status, name='task_status'),
    url(r'^add/$', add_task, name='add_task'),

    url(r'^test/$', TestPage.as_view(), name='test_page'),
    url(r'^task_list.json$', task_list_json, name='task_list_json'),
)
