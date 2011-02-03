(function() {
  pema.observer.addRoute("#/contacts/delete/([0-9]*)", function(matches){
    $( pema.observer ).trigger( "#/contacts/delete/:id", { 
      route: pema.hash_path(),
      id: matches[1]
    }); 
  }); 

  pema.observer.addRoute("#/contacts/edit/([0-9]*)", function(matches){
    $( pema.observer ).trigger( "#/contacts/edit/:id", { 
      route: pema.hash_path(),
      id: matches[1]
    }); 
  }); 

  pema.instance('contactsController').init(); 
  pema.instance('contentController').init(); 
  pema.observer.init();
}) ()
