(function(){

  this.ContactForm = function (){
    var dom  = {};
    var self = this;
    self.contact = null;
    
    self.init = function(){    
      dom.view = $( "#contact-edit-view" )
      dom.form = $( "#contact-form" )
      dom.errors = dom.form.find( "div.form-errors" )
      dom.fields = {
        id:    dom.form.find( ":input[ name = 'id' ]" ),
        name:  dom.form.find( ":input[ name = 'name' ]" ),
        phone: dom.form.find( ":input[ name = 'phone' ]" ),
        email: dom.form.find( ":input[ name = 'email' ]" )
      }

      dom.cancelLink = dom.form.find( "div.actions a.cancel" );
      
      // This method should go in the controller. 
      // But for now it going to stay here. 
      dom.form.submit(function() {      
        self.contact
          .attr("name",  dom.fields.name.val())
          .attr("phone", dom.fields.phone.val())
          .attr("email", dom.fields.email.val()); 

        if (self.contact.id()){
          pema.updateModel("contacts", self.contact);
        } else {
          self.contact
            .attr("id",  pema.models.contacts.count()+1);  // naive but ...

          pema.addModel("contacts", self.contact);
        }
        
        pema.redirect_to("#/contacts");
        return false;
      })
      
      dom.cancelLink.click( function( event ){
        return( confirm( "Are you sure you want to cancel?" ) ); 
      })
    }
    
    function clearErrors(){
      dom.errors.hide().find( "> ul" ).empty();
    }
    
    function resetForm(){
      clearErrors();
      dom.form.get( 0 ).reset();
    }
    
    self.hideView = function(){
      dom.view.css("display", "none" );
    }
    
    self.showView = function( ){
      var self = this;
      resetForm();
      dom.view.css("display", "block" );
      
      if (self.contact){
        dom.fields.id.val(    self.contact.attributes.id );
        dom.fields.name.val(  self.contact.attributes.name );
        dom.fields.phone.val( self.contact.attributes.phone );
        dom.fields.email.val( self.contact.attributes.email );
      }                    
      
      dom.fields.name[ 0 ].focus();
    }
  }

})()
