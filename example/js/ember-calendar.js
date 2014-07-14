Ember.EmberCalendarComponent =  Ember.Component.extend({
  needsRender: true,
  classNames: ['kalendar', 'calendar'], 
  tagName: 'ul',
  tasks: [], 

  // configurable variables/params
  weeks: 5, 
  setScheduledAtMethod: "setScheduledAt", 
  // 'date' name or method to access its date - default scheduledAt
  // 'tag'  name or method to access its tagname for calendar-coloring - those tags get modified on the css
  // 'name'  name or method to access its text on the calendar
  // isCompleted
  // save tasks for future reference? - update calendar on event
  // link method with task as a param 
  // calendar.options - day names, starting day, size? ... 
  // calendar-cell onclick event callback // if any, redirect to nested view (new_x) with a modal with the date as param
  // calendar-task element onclick_event/option_click callback // redirect to show view or edit modal view 
  // dragable? - callback on element to update its date

  // pending
  // multi-date tasks

  didInsertElement: function(){

    this.setDaysToCalendar(this.controller)
    this._super();
    console.log("this.needsRender: ", this.needsRender);
    if(!this.needsRender){ return; }
    // works only when loaded for first time

    var ember_calendar = this
    ember_calendar.set("tasks", (ember_calendar.get('tasks')||[]))
    ember_calendar.fillCalendar(ember_calendar.tasks, ember_calendar)
    ember_calendar.needsRender = false;
    ember_calendar.activateDragAndDrop(ember_calendar);
  },

  filter: function(task, elementMatch){
    modelName = elementMatch["model"]
    modelId = elementMatch["id"]
    return false
  },
  // taskRoute: function(task){
  //   // missions/1/tasks/1
  //   missionId = task.get("mission").id
  //   taskId = task.id
  //   var str = ["/#/missions", missionId, "tasks", taskId].join("/")
  //   return  str;
  // },
  fillCalendar: function(tasks, context){
    var self = this;

    tasks.map(function(task){
      // discard task if filter doesnt apply to it
      // model is the current one (model={shop, user}, id=modelId)
      // if(self.filter(task, elementMatch, context)){return;}

      var taskDate = task['scheduledAt'] || task.get("scheduledAt");
      var name = (task['name'] || task.get("name"))
      var className = (task.hasOwnProperty('isCompleted') ? task['isCompleted'] : task.get('isCompleted')) ? "completed" : "pending"

      if(taskDate){
        taskDate = taskDate.toLocaleDateString()
      }
      var $elem = $("[data-date='"+taskDate+"']", ".valid")
      if($elem){
        // var str = "<div class='task' data-id='"+task.id+"'><a href='"+self.taskRoute(task)+"'}}>" + task.get("name") + "</a></div>";

        var str = "<div class='task' data-id='"+task.id+"' draggable='true'><a class='"+className+"' href='#'>" + name + "</a></div>";
        var $target = $(".valid[data-date='"+taskDate+"'] .tasks")
        $target.append(str)
      }
    })
  },

  setDaysToCalendar: function(controller){
    currentDate = new Date()
    firstDate = new Date()
    lastDate = new Date()
    // update according to date-ranged given
    firstDate = this.changeDate(currentDate, -14)
    lastDate  = this.changeDate(currentDate, 14)

    date = new Date(firstDate.toJSON())
    var day = firstDate.getDay()
    var weeks = $(".week").length;
    for(var week=1; week <= weeks; week++){
      for(; day >= 0; day=(++day)%7){
        $elem = $("[data-week="+week+"] [data-day="+day+"]")
        $elem.addClass("valid")
        if(date < currentDate){
          $elem.addClass("past")
        } else if(date > currentDate) {
          $elem.addClass("future")
        } else {
          $elem.addClass("today")
        }

        // check if weekend
        if (day == 6 || day == 0) {
          $elem.addClass('weekend');
        }

        // add date to calendar
        $elem.attr("data-date", date.toLocaleDateString())
        $(".date", $elem).append(date.getDate())

        // advance a day
        date = this.changeDate(date, 1)
        if(week == weeks){
          if(day == lastDate.getDay()){
            day = -2; // after ++ still < 0
          }
        }
        if(day==0){
          day = -2; // after ++ still < 0
        }
      }
      // restart week
      day = 1;
    }

    // adding active week and adding classes to every day
    $('ul.week:has(.today)').addClass('present-week').find('.day').addClass('present-week-day');
  },
  changeDate: function(date, days){
    if(days == 0){
      return date;
    }
    var _date = new Date(date.toJSON())
    var _day = date.getDate();
    var _month = date.getMonth();
    var _year = date.getYear();
    if(days > 0){
      _date.setDate(date.getDate() + 1)
      if(_date.getDate < _day){
        _date.getMonth(_month + 1);
        if(_date.getMonth < _month){
          _date.setYear(_year + 1)
        }
      }
      return this.changeDate(_date, days - 1)
    }
    // else - days < 0
    _date.setDate(date.getDate() - 1)
    if(_date.getDate > _day){
      _date.getMonth(_month - 1);
      if(_date.getMonth > _month){
        _date.setYear(_year - 1)
      }
    }
    return this.changeDate(_date, days + 1)
  },

  getTaskById: function(id){
    return this.get("tasks").filter(function(obj){
      return obj.id == id
    })[0]
  },
  
  // View effects 
  cleanTargetDayCell: function(){
      targetDayCell = ""
  },
  handleDragEnter: function(e) {
    this.classList.add('over');
    targetDayCell = $(this).data("date");
  },
  handleDragLeave: function(e) {
    this.classList.remove('over');
  },
  handleDragEnd: function(context){
    return function(e) {
      var html = e.target;
      $(".day[data-date='"+targetDayCell+"'] .tasks").append(html);
      html.classList.remove('drag_object');
      var task = context.getTaskById( $(html).data("id") );
      if(task && task[context.setScheduledAtMethod]){
        task[context.setScheduledAtMethod](new Date(targetDayCell));
      }
    }
  },
  handleDragStart: function(e) {
    e.target.classList.add('drag_object')
  },
  activateDragAndDrop: function(context){
    var targetDayCell = ""
    var cels = $('.day') 
    cels.map(function(i, cel){
      cel.addEventListener('dragend',   context.handleDragEnd(context), false)
      cel.addEventListener('dragenter', context.handleDragEnter, false)
      cel.addEventListener('dragleave', context.handleDragLeave, false)
      cel.addEventListener('dragstart', context.cleanTargetDayCell, false)
    })
    var cols = $('.kalendar .task');
    cols.map(function(i, col) {
      col.addEventListener('dragstart', context.handleDragStart, false);
      // col.addEventListener('drop', handleDrop, false); // does not trigger
    });    


  }  


})
