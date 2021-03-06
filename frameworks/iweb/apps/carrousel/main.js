// ==========================================================================
// Project:   Carrousel
// Copyright: @2011 Strobe, Inc.
// ==========================================================================
/*globals Carrousel */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
Carrousel.main = function main() {

  // Step 1: Instantiate Your Views
  // The default code here will make the mainPane for your application visible
  // on screen.  If you app gets any level of complexity, you will probably 
  // create multiple pages and panes.  
  Carrousel.getPath('mainPage.mainPane').append() ;

  // Step 2. Set the content property on your primary controller.
  // This will make your app come alive!
  var thumbs = [];
  for (var i = 10; i >= 0; i--){
    var thumb = SC.Object.create({
      order: i
    });
    thumbs.push(thumb);
  };
  Carrousel.thumbsController.set('content',thumbs);

  // TODO: Set the content property on your primary controller
  // ex: Carrousel.contactsController.set('content',Carrousel.contacts);

} ;

function main() { Carrousel.main(); }
