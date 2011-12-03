var CeleryTask = Backbone.Model.extend({
    defaults: { // default attributes for new models
        'status': 'PENDING',
        'result': null,
    },
    defaultOptions: { // default options, user can override on init
        interval: 1000, // poll interval (ms)
        autoPoll: true, // automatically poll the update URL
        urlRoot: '/tasks/status/', // Get task status from /urlRoot/<task_id>
    },
    READY_STATES: ['SUCCESS', 'FAILURE', 'REVOKED'],
    initialize: function(model, options) {
        _.bindAll(this, 'poll', 'updateState', 'startPolling', 'stopPolling');

        // Set up options. User-specified options are checked first, followed
        // by the model defaults.
        // TODO add support for Collection-level defaults for new tasks
        this.opts = $.extend({}, this.defaultOptions, options);
        this.urlRoot = this.opts.urlRoot;

        // set up an event handler for status changes
        this.bind('change:status', this.updateState);

        // start the first poll, if required
        if (this.opts.autoPoll) {
            this.startPolling();
        }
    },
    parse: function(data) {
        // returns the object in the format expected by backbone
        return data.task;
    },
    poll: function() {
        // fetch the latest results from the server
        this.fetch();
    },
    startPolling: function() {
        this.timer = setInterval(this.poll, this.opts.interval);
    },
    stopPolling: function() {
        clearTimeout(this.timer);
    },
    updateState: function(model, resp) {
        // the status of the model has changed, so trigger the relevant
        // events
        newStatus = this.get('status');
        this.trigger('task_' + newStatus, this);
        if (this.collection) {
            this.collection.trigger('task_updated', this);
        }
        if (this.READY_STATES.indexOf(newStatus) != -1) {
            // stop polling if the task is complete
            this.stopPolling();
        }
    },

});

var CeleryTasks = Backbone.Collection.extend({
    model: CeleryTask,
    initialize: function(options) {
        _.bindAll(this, 'createTask', '_addTask', 'startPolling', 'stopPolling', 'pollAll',
                        '_pendingTasks');
    },
    _addTask: function(data) {
        // Parse the task_id from the response and add() the new task to the
        // collection
        this.add({id: data.task_id});
    },
    _pendingTasks: function() {
        // returns all tasks with status=='PENDING'
        return _.filter(this.models, function(item) {
            return item.get('status') == 'PENDING';
        })
    },
    createTask: function() {
        // Dummy function - creates a new task by GETting the add_task view
        $.getJSON('/tasks/add/', '', this._addTask);
    },
    pollAll: function() {
        _.each(this._pendingTasks(), function(task) {
            task.pol();
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
