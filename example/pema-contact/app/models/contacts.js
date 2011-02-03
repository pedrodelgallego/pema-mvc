Contact = Model("Contact", {
  validate: function() {
    if (this.attr("name") ==  "")
      this.errors.add("body", "can't be blank");
  }
})

pema.addCollection('contacts', Contact);


