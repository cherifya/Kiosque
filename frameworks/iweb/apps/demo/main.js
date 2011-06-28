// ==========================================================================
// Project:   Tab
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Tab */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
Tab.main = function main() {

  // Step 1: Instantiate Your Views
  // The default code here will make the mainPane for your application visible
  // on screen.  If you app gets any level of complexity, you will probably 
  // create multiple pages and panes.  
  Tab.getPath('mainPage.mainPane').append() ;

  // Step 2. Set the content property on your primary controller.
  // This will make your app come alive!

  var query = SC.Query.local(Tab.Song, { orderBy: 'title' });
	var songs = Tab.store.find(query);
	Tab.songsController.set('content',songs);
	
	var view = SC.View.create({
	  layout: { top: 0, right: 0, bottom: 0, left: 0 },
	  childViews: 'pushButton'.w(),
		backgroundColor: 'green',
		title: 'Green',
		topToolbar: SC.NavigationBarView.design({
		  childViews: 'labelView'.w(),
		
			labelView: SC.LabelView.design({
			  layout: { centerX: 0, centerY: 0, width: 100, height: 24 },
			  value: 'Green',
				textAlign: SC.ALIGN_CENTER,
				controlSize: SC.HUGE_CONTROL_SIZE
			})
		}),
		
		pushButton: SC.ButtonView.design({
		  layout: { centerX: 0, centerY: 0, width: 100, height: 24 },
		  title: 'Push Yellow',
		  action: 'pushYellow',
		  target: 'Tab.myController',
			controlSize: SC.HUGE_CONTROL_SIZE
		}),
	});
	Tab.mainPage.mainPane.tabbedView.sceneView.master1.push(view);

} ;

function main() { Tab.main(); }
