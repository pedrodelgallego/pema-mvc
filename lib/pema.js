//     Pema.js 0.3.3
//     (c) 2011 Pedro Del Gallego
//     Pedro Del Gallego may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://github.com/pedrodelgallego


(function() {

  /*
   * I can't belive that this is not the default behaviour of the 
   * localStorage object. What the W3c guys were thingking about. 
   */

  Storage.prototype.setObject = function(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  Storage.prototype.getObject = function(key) {
    return localStorage.getItem(key) && JSON.parse(localStorage.getItem(key));
  }
  
  // Initial Setup
  // -------------

  // The top-level namespace. All public Pema classes and modules will
  // be attached to this. 
  this.pema = {}

  
  // Current version of the library. Keep in sync with `package.json`.
  pema.VERSION = "0.0.1"

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = this._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore')._;
    
  pema.models      = {}; 
  pema.controllers = {}; 
  pema.views       = {};  
  pema.routes      = {}; 
  pema.helpers     = {}; 
  
  /**
   * Add a model collection to the namespace
   * 
   * @parameter name of the collection 
   * 
   * @parameter Function that initizilize create the container of 
   * collection, the function must return a iterable collection 
   * with at least the following methods: 'find' and 'all'
   * 
   * @example: pema.models.addCollection('contacts', function(){
   *              pema.models[contacts] = Model.Collection()
   *           });
   *
   **/
  pema.addCollection =  function(name, fn){        
    pema.models[name] = fn;
    pema.models[name].load();

  }

  pema.addModel = function(collection, model){        
    model.save();
    pema.models[collection].add(model);  
    pema.models[collection].load();
  }
  
  pema.removeModel = function(collection, data) {    
    var id = parseInt(data.id);
    pema.models[collection].find(id).destroy()    
  }
  
  // Rewrite this in a less destructive way !!! 
  pema.updateModel = function(collection, model){
    model.save();

    // remove the old data model 
    var tmp =  _.reject(localStorage.getObject(collection), function(m){  return m.id ==  model.id()});
    localStorage.setObject(collection, tmp);

    // Add the new data
    tmp.push(model.attributes);
    localStorage.setObject(collection, tmp);
  }

  pema.addController =  function(name, fn){
    pema.controllers[name] = fn
  }
  
  pema.addView = function(name, fn) { 
    pema.views[name] = new fn().init()
  }

  /*
   * This function act as a short cut to the routes of a object
   */
  $pema = function(name){
    return pema.controllers[name] || pema.observers[name]
  }

  pema.init = function(fn) {
    for (var name in pema.controllers) {
      pema.instance(name).init(); 
    }    

    pema.observer.init();
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

  pema.render = pema.helpers.getFromTemplate;

  // namespace for the observers
  pema.observers = {}

  /**
   * Abstract Observer is an abstract base class. 
   * It is defined the pull methods to check a 'Observable' object and 
   * the initialization method
   *  
   * This is a very naked class you will inheritated ot mixin from this 
   * class when you need a very customizable behaivour.
   * 
   * @constructor
   */
  pema.observers.abstractObserver = function AbstractObserver(){
    this.timeInterval = 100 

    this.init = function(){
      setInterval( this.checktick, this.timeInterval );
    }
    
    this.checktick = function(){     
      return pema.observer.check()
    }
  }

  pema.observers.locationObserver = function LocationObserver(){
    this.notify = function(route){
      for (i in this.subscribers){
        this.subscribers[i].execute(route)
      }
    }
    
    this.obtainRoute = function(){
      return window.location.href
    }

    this.check = function(){ 
      if (this.currentLocation != this.obtainRoute() ){                       
        this.currentLocation = this.obtainRoute()
        this.notify(pema.hash_path())
        return true
      }           
      return false
    }  
  }

  pema.observers.locationObserver.prototype = new pema.observers.abstractObserver(); 

  pema.observers.subscriberObserver = function SubscriberObserver ()  {

    this.subscribers = []
    
    this.subscribe = function(subscriber){
      this.subscribers.push(subscriber)
    }

    this.unsubscribe = function(){
      // TODO
    }
  }

  pema.observers.subscriberObserver.prototype = new pema.observers.abstractObserver(); 

  /*
   * This is the DefaultObserver that is provided with Pema
   * 
   */
  pema.observers.defaultObserver = function DefaultObserver(){}
  pema.helpers.mixin(pema.observers.defaultObserver, pema.observers.locationObserver )
  pema.helpers.mixin(pema.observers.defaultObserver, pema.observers.subscriberObserver)

  pema.observer = pema.observers.defaultObserver();


  /*
   * This is the JqueryObserver that is provided with Pema
   * 
   */
  function jQueryObserver(){		
    var self = this; 

    if (! (self instanceof arguments.callee)) {
      return new arguments.callee(arguments);
    }

    self.dispatcher = []

    self.notify = function(){
      var matches, hash 

      hash = pema.hash_path();
      
      for (action in self.dispatcher){
        if (matches = hash.match( new RegExp(self.dispatcher[action].route))){
          self.dispatcher[action].fn(matches)
        }
      }

      $( pema.observer ).trigger( hash, { 
        route: hash
      })
    }
    
    self.subscribe = function(route, fn){
      $( pema.observer ).bind(route, fn)
    }
    
    self.addRoute  = function(route, fn){
      var action   = {}
      action.route = route 
      action.fn    = fn
      this.dispatcher.push(action) 
    }
  }       

  pema.helpers.mixin(jQueryObserver, pema.observers.defaultObserver)	
  
  pema.observer = new jQueryObserver(); 

}).call(this);

