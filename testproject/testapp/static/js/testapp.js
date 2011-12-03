/**
 * Demonstration Backbone.js app showing how the Task Model/Collection can be
 * used.
 */
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
        // dummy function - just calls createTask on the collection.
        this.tasks.createTask(opts);
    },
    startPolling: function() {
        this.tasks.startPolling();
    },
    stopPolling: function() {
        this.tasks.stopPolling();
    },
});
