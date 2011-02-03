(function() {

  this.ContactsListView = function (){
    var self = this
    var dom  = {}
    
    this.init = function(){
      dom.stages           = $( "#primary-content-stages > li" )    
      dom.contactsView     = dom.stages.filter( "[ rel = 'contacts' ]" )                
      
      dom.view             = $( "#contact-list-view" )
      dom.contactList      = $( "#contact-list" )
      dom.contactTemplate  = $( "#contact-list-item-template" )
      dom.addLink          = $( "#contact-list-header a" )

      dom.searchForm       = $( "#contact-list-header form" );
      dom.searchCriteria   = dom.searchForm.find( "input" );
      
      dom.contactList.click(function( event ){
        var target = $( event.target )		    
        target.blur()

        if (target.is( "a.more" )){
	  toggleDetails( target.parents( "li" ) )		    
          return( false )

        }else if (target.is( "a.delete" )){                        
	  if (confirm( "Delete this contact?" )){			    
            return true
          }
	  return( false )                       
        }
        
      })

      // Bind the search form submit.
      dom.searchForm.submit( function( event ){ 
        return( false );  
      })
      
      dom.addLink.click(function(){
        pema.redirect_to("/contacts/add")
      })

      dom.searchCriteria.keyup(  function( event ){
        filterList( this.value );
      })

    }
    
    function clearList(){
      dom.contactList.empty();
    }
    
    function toggleDetails( contactListItem ){
      contactListItem.find( "> dl.details" ).slideToggle( 250 )
    }
    
    this.hideView = function(){
      dom.view.hide();
    }
    
    this.showStage = function(){		
      dom.stages.hide();
      dom.contactsView.show();
    }

    this.showView = function(){		
      clearList()
      dom.view.show();
      populateList(pema.models.contacts.all())
    }
    
    function populateList(collection){
      // Loop over the contacts and create templates.
      $.each(collection ,
	     function( index, model ){
	       dom.contactList.append( 
	         pema.helpers.getFromTemplate( dom.contactTemplate, model) 
	       )
	     }
	    )
        }
    
    function clearSearchForm(){
      dom.searchForm[ 0 ].reset();
    };		

    function filterList( criteria ){
      criteria = criteria.toLowerCase();
      
      // Get all the list items that do NOT match the criteria and hide them.
      dom.contactList.find( "> li" )
      // Show all the items.
        .show()		
      // Filter down to the ones that don't match.
        .filter( function( index ){
	  var contact = $( this ).data( "model" );
	  
	  // Check the domain values.
	  var matchesCriteria = (
	    (contact.attributes.name.toLowerCase().indexOf( criteria ) >= 0)  ||
	      (contact.attributes.phone.toLowerCase().indexOf( criteria ) >= 0) ||
	      (contact.attributes.email.toLowerCase().indexOf( criteria ) >= 0)
	  );
	  
	  return( !matchesCriteria );	
        })
        .hide();
    };
  }

}) ()
