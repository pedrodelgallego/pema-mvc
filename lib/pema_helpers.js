
/*
 * This function act as a short cut to the routes of a object
 */
$pema = function(name){
  return pema.controllers[name] || pema.observers[name]
}

pema.instance = function(name){
  obj = pema.controllers[name] || pema.observers[name]
  return  new (obj)()
}

pema.redirect_to = function(path) {
  window.location.hash = path
}

pema.hash_path = function() {
  return window.location.hash;
}

pema.helpers =  {
  mixin: function mixin(receivingClass, givingClass) {
    Klass = new givingClass()
    for(methodName in Klass) {
      if(!receivingClass[methodName]) {
        receivingClass.prototype[methodName] = Klass[methodName];
      }
    }
  },
  
  __mixin__: function (receivingClass, givingClass) {
    Klass = new givingClass()
    for(methodName in Klass) {
      receivingClass.prototype[methodName] = Klass[methodName];
    }
  },

  getFromTemplate: function( template, model ){
    // Get the raw HTML from the template.
    var templateData = template.html();
    
    // Replace any data place holders with model data.
    templateData = templateData.replace(
      new RegExp( "\\$\\{([^\\}]+)\\}", "gi" ),
      function( $0, $1 ){
	// Check to see if the place holder corresponds to a model property.
	// If it does, replace it in.
	if ($1 in model.attributes){
	  // Replace with model property.
	  return( model.attributes[ $1 ] );
        } else {
	  // Model property not found - just return what was already there.
	  return( $0 )
	}
      }
    );
    
    // Create the new node, store the model data internall, and return 
    // the new node.
    return( $( templateData ).data( "model", model ) );
  }
}
