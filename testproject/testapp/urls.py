from django.conf.urls.defaults import patterns, include, url
from djcelery.urls import task_pattern
from djcelery.views import task_status
from .views import AppView
from .tasks import add as add_task

urlpatterns = patterns('',
    # The task_status URL has no trailing slash - although it breaks the
    # convention of the other URLs, it saves appending a slash in JS.
    url(r'^status/%s$' % task_pattern, task_status, name='task_status'),

    # Simple view that uses djcelery.views.task_view, so we can easily add
    # tasks to display in the Backbone.js view.
    url(r'^add/$', add_task, name='add_task'),
 
    url(r'^app/$', AppView.as_view(), name='app_view'),
)
