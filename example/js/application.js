
// for more details see: http://emberjs.com/guides/application/
ExampleApp = Ember.Application.create({
  // LOG_TRANSITIONS: true, 
  // LOG_TRANSITIONS_INTERNAL: true, 
  // LOG_VIEW_LOOKUPS: true, 
  // LOG_ACTIVE_GENERATION: true, 
  // LOG_BINDINGS: true
});

// Initialization!
ExampleApp.EmberCalendarComponent = Ember.EmberCalendarComponent;


// Router
ExampleApp.Router.map(function() {
  this.route("home", { path: "/" });
});
ExampleApp.Router.reopen({
  rootURL: '/'
})

// basic view
ExampleApp.HomeView = Ember.View.extend({
  // templateName: "home", 
  didInsertElement: function(){
    console.log("Home view!")
  }
});


ExampleApp.ApplicationAdapter = DS.FixtureAdapter.extend();

ExampleApp.Task = DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  scheduledAt: DS.attr('date'),
  completedAt: DS.attr('date'),
  isCompleted: DS.attr('boolean')

  // setScheduledAt: function(){
  //   // heavily depedant on the new/edit form
  //   var date = $(".task-date-picker").val()
  //   var time = $("#timepicker1").val()
  //   new_date = date.split("/")
  //   valid_date = [new_date[1], new_date[0], new_date[2], time].join(" ")
  //   var datetime = new Date(valid_date) // !!
  //   this.set("scheduledAt", datetime)
  //   return datetime
  // }
});

var today = Ember.Date.constructor(new Date())
var yesterday = Ember.Date.constructor(new Date())
yesterday.setDate(yesterday.getDate() - 1)
ExampleApp.Task.FIXTURES = [
  {
    id: 1,
    name: 'Learn Ember.js',
    isCompleted: true, 
    scheduledAt: today
  },
  {
    id: 2,
    name: 'Add ember calendar',
    isCompleted: false, 
    scheduledAt: yesterday
  },
  {
    id: 3,
    name: 'Enjoy!',
    isCompleted: false, 
    scheduledAt: yesterday
  }
];

