ExampleApp.EmberCalendarComponent =  Ember.Component.extend({
  needsRender: true,

  didInsertElement: function(){
    this.setDaysToCalendar(this.controller)
    this._super();
    console.log("this.needsRender: ", this.needsRender);
    if(!this.needsRender){ return; }
    // works only when loaded for first time

    self = this
    // ExampleApp.Task.store.find("task").then(function(tasks){
    //   self.fillCalendar(tasks, self)
    // })
    this.needsRender = false;
  },

  filter: function(task, elementMatch){
    modelName = elementMatch["model"]
    modelId = elementMatch["id"]
    return false
  },
  taskRoute: function(task){
    // missions/1/tasks/1
    missionId = task.get("mission").id
    taskId = task.id
    var str = ["/#/missions", missionId, "tasks", taskId].join("/")
    return  str;
  },
  fillCalendar: function(tasks, context){
    target = context.get("renderedName") || this.renderedName
    modelName = Ember.Inflector.inflector.singularize(target.split(".")[0])
    modelId = context.controller.get("id")
    elementMatch = {model: modelName, id: modelId}

    self = this;

    tasks.map(function(task){
      // discard task if filter doesnt apply to it
      // model is the current one (model={shop, user}, id=modelId)
      if(self.filter(task, elementMatch, context)){return;}

      taskDate = task.get("scheduledAt");
      if(taskDate){
        taskDate = taskDate.toLocaleDateString()
      }
      $elem = $("[data-date='"+taskDate+"']", ".valid")
      if($elem){
        var str = "<div class='task' data-id='"+task.id+"'><a href='"+self.taskRoute(task)+"'}}>" + task.get("name") + "</a></div>";
        var target = $(".valid[data-date='"+taskDate+"'] .tasks")
        $(target).append(str)
      }
    })
  },

  setDaysToCalendar: function(controller){
    currentDate = new Date()
    firstDate = new Date()
    lastDate = new Date()
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
  }
})
