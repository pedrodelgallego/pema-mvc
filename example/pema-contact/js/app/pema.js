var pema = {

    models:{ 
        classes: {},

        add: function(name,object){
            this[name][object.id] = object
            this[name].size++
        },

        add_all: function(name, models){
            console.log("hiyaaay")
            for (model in models){
                console.log(models[model])
                this.add(name, models[model])
            }            
        },
        
        build: function(name){
            this.classes[name]()
        }, 

        register: function(name, klass){
            this[name]= {size:0};

            this.classes[name]= klass;
        },
        
        delete_all: function(name){
            this[name]= {size:0};
        }
        
    },

    views: {}, 
    controllers: {},
    routes: {},     

    helpers: {

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

    }
}