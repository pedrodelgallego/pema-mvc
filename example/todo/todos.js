$(function(){

  // Todo Model
  var Todo = Model("Todo", {
    persistence: Model.localStorage(), 
    markAsDone: function() {
      this.attr("done", true)
    }
  })

  // Todo Collection
  // ---------------
  pema.addCollection('todos', Todo);  

  // Todo Form View
  // ---------------

  pema.addView ("TodoForm", 
    function     (){
      var self = this;     
      
      this.init = function(){    
        $form     = $( "#create-todo" )
        $new_todo = $form.find( "#new-todo" )      

        $form.submit(function() {      
          self.params = { body: $new_todo.val(), id: new Date().getTime() };
          pema.redirect_to("#/todo/create")
          return false;
        })              

        return this;
      }
    }
  )

  // Todo List View
  // ---------------
  pema.addView("TodoListView", 
    function () {
      var  self = this;
      var $todoList     = $('#todo-list');          
      var $todoTemplate = $('#item-template');

      this.init = function()  {      
        this.populateList($todoList, pema.models.todos.all(), $todoTemplate )      
        return this;
      }    

      this.populateList = function( list ,collection, template) {
        _.map( collection, function(model){list.append( pema.render( template, model ) ) })
      }
      
      this.update = function(new_todo) {
        $todoList.empty(); 
        self.populateList($todoList, pema.models.todos.all(), $todoTemplate ); 
      }      
    }
  )
  
  // Todo Controllder
  // ---------------

  pema.addController('TodosController',  function TodosControllers(){        
    var self = this;    

    this.init = function(){          
      pema.models.todos.bind( "add",    pema.views["TodoListView"].update);
      pema.models.todos.bind( "remove", pema.views["TodoListView"].update);
      return this;
    };

    this.create = function( event, data ){ 	        
      var todo = new Todo( pema.views["TodoForm"].params);
      pema.addModel("todos", todo );    
      pema.redirect_to("")
    };

    this.remove = function(event, data){                
      console.log(data)
      pema.removeModel("todos", data)
      pema.redirect_to("")
    };

    pema.observer.subscribe("#/todo/create",         self.create );
    pema.observer.subscribe("#/todos/destroy/:id", self.remove);

  });
  
  pema.observer.addRoute("#/todos/destroy/([0-9]*)", function(matches){    
    $( pema.observer ).trigger( "#/todos/destroy/:id", { 
      route: pema.hash_path(),
      id: matches[1]
    }); 
  });

  pema.init();

})
