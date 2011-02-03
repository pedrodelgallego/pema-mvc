
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
