from celery.task import task
from djcelery.views import task_view
from time import sleep

@task_view
@task
def add(x=1, y=2, z=5):
    sleep(z)
    return x + y
