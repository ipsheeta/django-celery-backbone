django-celery-backbone
======================

An Django app to demonstrate integration between Celery and Backbone.js.

This does not yet do anything useful - it just modifies the standard djcelery
TaskState admin view, so that it uses Backbone.js to populate the list of
tasks.

See testproject/celery_backbone/static/js/celery_backbone.js and
testproject/celery_backbone/templates/task_status.html for example usage.

In future I plan to add more useful features to the Backbone.js classes, e.g.
polling for task status, call events when tasks succeed/fail, etc.


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
