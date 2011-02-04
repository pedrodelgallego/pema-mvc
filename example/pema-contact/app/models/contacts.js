(function(){
  Contact = Model("Contact", {
    persistence: Model.localStorage(), 
    validate: function() {
      if (this.attr("name") ==  "")
        this.errors.add("body", "can't be blank");
    }
  })

  pema.addCollection('contacts', Contact);

})()
