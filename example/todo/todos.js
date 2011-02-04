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

      this.init = function()  {      
        this.populateTodoList()      
        return this;
      }    

      this.populateTodoList = function( ) {
        var $taskTemplate = $('#item-template');

        // render each todo item and append it to the tood-list node
        pema.models.todos.each(  function(model){
          $todoList.append( pema.render( "#item-template", this ) ) }
        )

      }
      
      this.update = function(new_todo) {
        $todoList.empty(); 
        self.populateTodoList( ); 
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
