from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

from djcelery import urls as celery_urls

urlpatterns = patterns('',
    url(r'^tasks/', include('celery_backbone.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^c/', include(celery_urls)),
)
