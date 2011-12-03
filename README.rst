backbone.celery.js
======================

A `Backbone.js`_ plugin for `Celery`_. I am still working on this, it is not 
entirely useful yet. Ideas and suggestions are very welcome.

.. _`Backbone.js` : http://documentcloud.github.com/backbone/
.. _`Celery` : http://celeryproject.org/

Create individual tasks and bind to their events::

    var task = new CeleryTask({
        id: '785ba181-4c8b-4b35-a6c4-f47ad6b8d11a'
    },
    {
        interval: 5000,
        autoPoll: true
    });
    task.bind('task_SUCCESS', taskSucceeded);
    task.bind('task_FAILED', taskFailed);

Or create task collections and deal with tasks as groups::
    
    var tasks = new CeleryTasks();
    tasks.add({id: '...'});
    tasks.add({id: '...'});
    tasks.pollAll();

This repo includes a demonstration Django project so the plugin has
something to query. The demonstration task (which takes no args yet) will
return 3 after sleeping for 5 seconds.

There is also a very simple Backbone.js app, which shows how the
Model/Collection can be used, and how to automatically update a Backbone
view to display the latest results from a task.


Getting started
---------------

Download the app, syncdb etc.


Start celerycam (so Task information is stored in the database):

    ./manage.py celerycam

Start celeryd (-E tells celeryd to send events, which are picked up by 
celerycam:

    ./manage.py celeryd -l info -E

Run the development server:

    ./manage.py runserver 127.0.0.1:8080

Open the test page in a browser:

    http://127.0.0.1:8080/tasks/app/

Click 'New task' to create a new task which will be automatically polled.
