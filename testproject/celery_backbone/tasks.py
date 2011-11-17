from celery.task import task
from time import sleep

@task
def add(x, y):
    sleep(10)
    return x + y
