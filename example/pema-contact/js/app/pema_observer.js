
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
function AbstractObserver(){
    this.timeInterval = 100 

    this.init = function(){
        setInterval( this.checktick, this.timeInterval );
    }
    
    this.checktick = function(){     
        return pema.observer.check()
    }
}

function LocationObserver(){
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
            this.notify(window.location.hash)
            return true
        }           
        return false
    }
    
}
LocationObserver.prototype = new AbstractObserver(); 

function SubscriberObserver ()  {

    this.subscribers = []
    
    this.subscribe = function(subscriber){
        this.subscribers.push(subscriber)
    }

    this.unsubscribe = function(){
        // TODO
    }
 
}
SubscriberObserver.prototype = new AbstractObserver(); 



/*
* This is the DefaultObserver that is provided with Pema
* 
*/
function DefaultObserver(){}
pema.helpers.mixin(DefaultObserver, LocationObserver )
pema.helpers.mixin(DefaultObserver, SubscriberObserver)

pema.observer = new DefaultObserver();

