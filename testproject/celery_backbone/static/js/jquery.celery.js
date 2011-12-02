/* TODO there is a bug in this : start 3 tasks really quickly
        with autoPoll:true, and the last result won't get set.

        if that doesn't replicate it, try creating one task, waiting,
        then creating 3 more.
    */
var CeleryTask = Backbone.Model.extend({
    defaults: { // default attributes for new models
        'status': 'PENDING',
        'result': null,
    },
    defaultOptions: { // default options, user can override on init
        interval: 1000, // poll interval (ms)
        autoPoll: true, // automatically poll the update URL?
    },
    initialize: function(model, options) {
        _.bindAll(this, 'poll', 'updateState', 'startPolling', 'stopPolling', 'doNextPoll');

        // Set up options. User-specified options are checked first, followed
        // by the collection's defaults (if this model is part of one), then
        // the model defaults.
        if ('collection' in this) {
            collOpts = this.collection.opts;
        }
        else {
            collOpts = {};
        }
        this.opts = $.extend(this.defaultOptions, collOpts, options);
        //console.log(this.opts);

        // set up an event handler for status changes
        this.bind('change:status', this.updateState);

        // start the first poll, if required
        if (this.opts.autoPoll) {
            this.startPolling();
        }
    },
    url: function() {
        return '/c/' + this.id + '/status/';
    },
    parse: function(data) {
        // returns the object in the format expected by backbone
        return data.task;
    },
    poll: function() {
        // fetch the latest results from the server
        this.fetch({
            //success: this.doNextPoll
        });
    },
    doNextPoll: function() {
        // Set up the timer for the next poll, if required. This is called
        // by fetch() after a successful poll (so the interval is the
        // delay between a response being received and the next request
        // being sent, rather than the delay between requests being sent).
    /*
        if (this.opts._doPoll) {
            // clear the timer in case it is already set
            clearTimeout(this.timer);
            this.timer = setTimeout(this.poll, this.opts.interval);
            console.log('using timer: ' + this.timer);
        }
    */
    },
    startPolling: function() {
        this.opts._doPoll = true;
        //this.poll();
        this.timer = setInterval(this.poll, this.opts.interval);
    },
    stopPolling: function() {
        console.log('clearing timer: ' + this.timer);
        this.opts._doPoll = false;
        clearTimeout(this.timer);
    },
    updateState: function(model, resp) {
        // the status of the model has changed, so trigger the relevant
        // events
        READY_STATES = ['SUCCESS', 'FAILURE', 'REVOKED'];
        newStatus = this.get('status');
        this.trigger('task_' + newStatus, this);
        if (this.collection) {
            this.collection.trigger('task_updated', this);
        }
        if (READY_STATES.indexOf(newStatus) != -1) {
            // stop polling if the task is complete
            this.stopPolling();
            console.log('stopping: ' + this.get('id'));
        }
    },

});

var CeleryTasks = Backbone.Collection.extend({
    model: CeleryTask,
    defaultOptions: { 
        // Collection-level default options for new CeleryTasks
    },
    initialize: function(options) {
        _.bindAll(this, 'createTask', '_addTask', 'startPolling', 'stopPolling', 'pollAll',
                        '_pendingTasks');

        this.opts = $.extend({}, this.defaultOptions, options);
    },
    _addTask: function(data) {
        // parse the task_id from the response and call add()
        // why are options not getting set on the model when added here?
        this.add({id: data.task_id}, {autoPoll: false, test1: 'testing'});
    },
    _pendingTasks: function() {
        // returns all tasks with status=='PENDING'
        return _.filter(this.models, function(item) {
            return item.get('status') == 'PENDING';
        })
    },
    createTask: function() {
        $.getJSON('/tasks/add/', '', this._addTask);
    },
    pollAll: function() {
        this.filter(function(task) {
            return task.get('status') == 'PENDING';
        }).each(function(task) {
            task.poll();
        });
    },
    startPolling: function() {
        _.each(this._pendingTasks(), function(task) {
            task.startPolling();
        });
    },
    stopPolling: function() {
        this.each(function(task) {
            task.stopPolling();
        });
    },
});


var TaskView = Backbone.View.extend({
    tagName: 'tr',
    className: 'task',
    initialize: function() {
        _.bindAll(this, 'render');
        this.template = _.template($('#taskTemplate').html());
        this.model.bind('change', this.render);
    },
    render: function() {
        $(this.el).html(this.template(this.model.toJSON())); 
        return this;
    },
});

var CeleryApp = Backbone.View.extend({
    events: {
        'click #addTask': 'createTask',
        'click #startPolling': 'startPolling',
        'click #stopPolling': 'stopPolling'
    },
    el: 'div#taskApp',
    initialize: function() {
        _.bindAll(this, 'appendItem', 'createTask', 'startPolling', 'stopPolling');
        this.tasks = new CeleryTasks();
        this.tasks.bind('add', this.appendItem);
    },
    appendItem: function(item) {
        taskView = new TaskView({ model: item });
        $('table#tasks', this.el).append(taskView.render().el);
    },
    createTask: function() {
        // dummy function - this just gets a task from the view decorator,
        // but should be able to POST and create a task
        this.tasks.createTask();
    },
    startPolling: function() {
        this.tasks.startPolling();
    },
    stopPolling: function() {
        this.tasks.stopPolling();
    },
});
