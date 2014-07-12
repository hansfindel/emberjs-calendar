
// for more details see: http://emberjs.com/guides/application/
ExampleApp = Ember.Application.create({
  // LOG_TRANSITIONS: true, 
  // LOG_TRANSITIONS_INTERNAL: true, 
  // LOG_VIEW_LOOKUPS: true, 
  // LOG_ACTIVE_GENERATION: true, 
  // LOG_BINDINGS: true
});

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
