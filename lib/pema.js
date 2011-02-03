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

var pema = {
  models:{  },    
  controllers:{},
  views: {}, 
  routes: {},    
  helpers: { }, 

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

  addCollection: function(name, fn){        
    pema.models[name] = Model.Collection();
    
    for(var i in localStorage.getObject(name)) {
      pema.models[name].add(new fn( localStorage.getObject(name)[i] ) );
    }    
  },

  addModel: function(collection, model){        
    model.save();
    var tmp = localStorage.getObject(collection); 
    tmp.push(model.attributes);
    localStorage.setObject(collection, tmp);
    pema.models[collection].add(model);  
  },
  
  removeModel: function(collection, data) {    
    var id = parseInt(data.id);
    pema.models.contacts.remove(id);
    var tmp =  _.reject(localStorage.getObject(collection), function(model){ return model.id == id});
    localStorage.setObject(collection, tmp);
  },

  
  // Rewrite this in a less destructive way !!! 
  updateModel: function(collection, model){    
    model.save();

    // remove the old data model 
    var tmp =  _.reject(localStorage.getObject(collection), function(m){  return m.id ==  model.id()});
    localStorage.setObject(collection, tmp);

    // Add the new data
    tmp.push(model.attributes);
    localStorage.setObject(collection, tmp);

  },

  addController: function(name, fn){
    pema.controllers[name] = fn
  },
  
  addView: function(name, fn){ }
}
