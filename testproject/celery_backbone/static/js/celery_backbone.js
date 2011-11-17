var Task = Backbone.Model.extend({
    // Model for an individual Celery Task
    initialize: function() {
        console.log('init ' + this.id);
    },

});

var TaskCollection = Backbone.Collection.extend({
    // Collection for Celery Tasks
    model: Task,
    url: '/tasks/task_list.json',
    parse: function(response){
        // convert the data provided by Django's JSON serialzer in to the
        // format Backbone's Collection expects
        return _.map(response, function(object){
            new_obj = object.fields;
            new_obj.id = object.pk;
            return new_obj;
        });
    }
});

var TaskView = Backbone.View.extend({
    // View for individual Tasks
    tagName: 'tr',
    initialize: function(){
        // cache the Underscore tmeplate for later reuse
        this.template = _.template($('#task-template').html());
    },
    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

});

var AppView = Backbone.View.extend({
    // App-level view to render a table containing Celery tasks //
    el: '#result_list', //attach to an existing table
    initialize: function(){
        _.bindAll(this, 'render', 'addTask', 'appendTask', 'redrawTaskList');
        this.tasks = new TaskCollection();
        this.tasks.bind('add', this.appendTask);
        this.tasks.bind('reset', this.redrawTaskList);
    },
    fetchTasks: function(){
        // call fetch on the collection to update the tasks list
        this.tasks.fetch();
    },
    addTask: function(task){
        // this is called by users of the library to add a task manually
        this.tasks.add(task);
        console.log('added task');
    },
    appendTask: function(task){
        // this gets called by the collection.add event 
        var taskView = new TaskView({ model: task});
        this.$(this.el, 'tr:last').append(taskView.render().el);
        console.log('appended task');
    },
    redrawTaskList: function(){
        // called by the collection.reset event - redraw the entire table
        $(this.el).html('');
        this.tasks.each(this.appendTask);
    },

});
