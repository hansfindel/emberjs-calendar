Handlebars.registerHelper('calendar', function(weeks, options) {
  // could add a row for day names (mon-tue-...)
  var dayNames = {
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday",
    "7": "Sunday"
  }

  var ret = "<ul class='calendar'>";
  ret = ret + "<ul class='day-names'>"
  for(var j=0; j<7; j++){
    ret = ret + "<li class='day' data-day='"+(j+1)%7+"'>"+ dayNames[j+1] +"</li>"
  }
  ret = ret + "</ul>"
  for(var i=0; i<weeks; i++) {
    ret = ret + "<ul class='week' data-week='"+ (i+1) +"'>"
    for(var j=0; j<7; j++){
      ret = ret + "<li class='day' data-day='"+(j+1)%7+"'><div class='date'></div><div class='tasks'></div></li>"
    }
    ret = ret + "</ul>"
  }
  ret = ret + "</ul>"

  return ret;
});
