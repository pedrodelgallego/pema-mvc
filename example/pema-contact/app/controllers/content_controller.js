(function() {
  pema.addController('contentController', function ContentController(){
    var self = this

    this.init = function(){
      this.views            = $( "#primary-content-stages > li" )     
      this.homeView         = this.views.filter( "[ rel = 'home' ]" )
      this.pageNotFoundView = this.views.filter( "[ rel = '404' ]" )
    },

    this.show = function( event, data ){
      self.views.css("display", "none" );
      self.homeView.css("display", "block" );
    }

    pema.observer.subscribe("#/home", this.show )
  })
}) ()
