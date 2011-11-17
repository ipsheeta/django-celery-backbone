django-celery-backbone
======================

An Django app to demonstrate integration between Celery and Backbone.js.


Getting started
---------------

Download the app, syncdb etc.


Start celerycam (so Task information is stored in the database):

    ./python manage.py celerycam

Start celeryd (-E tells celeryd to send events, which are picked up by 
celerycam:

    ./manage.py celeryd -l info -E

Run the development server:

    ./manage.py runserver 127.0.0.1:8080

Open the Task status page in a browser:

    http://127.0.0.1:8080/admin/djcelery/taskstate/

Create a task manually and make sure it is displayed in the admin page::

    ./manage.py shell
    from celery_backbone.tasks import add
    result = add.delay(1,2)
    result.get()
