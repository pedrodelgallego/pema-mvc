/***************************************************************
 *                  The Contacts Controller
 ***************************************************************/
pema.addController('contactsController',  function ContactsControllers(){        
    var self = this,
        my = {};

    my.contactForm  = new ContactForm();
    my.contactsView = new ContactsListView();
    
    this.init = function(){
        my.contactsView.init();                
        my.contactForm.init();
    };

    // Set the view that we want to display
    this.index = function( event, data ){
        hideAll();
        my.contactsView.showStage();
        my.contactsView.showView();
    };

    this.edit = function( event, data ){ 	             
        my.contactForm.contact = pema.models.contacts.find(data.id) || new Contact();
        hideAll();
        my.contactsView.showStage();
        my.contactForm.showView();
    };

    this.remove = function(event, data){                
      pema.removeModel("contacts", data)
    };

    // This function hide all the other views. 
    function hideAll(){
        my.contactsView.hideView();
        my.contactForm.hideView();
    }

    pema.observer.subscribe("#/contacts",            this.index );         
    pema.observer.subscribe("#/contacts/edit/:id",   this.edit );
    pema.observer.subscribe("#/contacts/add/",       this.edit );
    pema.observer.subscribe("#/contacts/delete/:id", this.remove );

    pema.models.contacts.bind("remove",function(){
      pema.redirect_to("/contacts");
    });

});
