// ==========================================================================
// Project:   IWeb.INavigationView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Tab */

/** @class

  Wrapper class around the excellent SC.NavigationView. This subclass
	automatically adds a back button to the provided toolbar with the title
	of the previous view in the stack as label. If you don't want this
	default button, set the leftBarView attribute of the toolbar class
	you're providing to your custom view.

  @extends SC.View
*/
Iweb.INavigationView = SC.NavigationView.extend(
/** @scope IWeb.INavigationView.prototype */ {
	rootView: null,
	
	init: function() {
		sc_super();
		
		var rootView = this.get('rootView');
		if(!SC.none(rootView)) {
			if(rootView.isClass) {
				rootView = this.createChildView(rootView);
				this.set('rootView',rootView);
			}
			this.push(rootView);
		}
	},

  topToolbarDidChange: function() {
		var topToolbar = this.get('topToolbar');
		
		var views = this._views;
		
		
		//add back button if no leftBarButton provided
		if(topToolbar && !topToolbar.get('leftBarView') && views.length >= 1) {
			var previousView = views[views.length-1];
			//make sure title is not empty or undefined 
			var title = SC.empty(previousView.title) ? 'Back' : previousView.title;
			
			var leftButton = SC.ButtonView.create({
			  layout: { left: 10, width: 90 },
			  title: title,
			  action: 'pop',
			  target: this,
				theme: 'point-left',
				controlSize: SC.HUGE_CONTROL_SIZE
			});
			
			topToolbar.appendChild(leftButton);
			topToolbar.set('leftBarView', leftButton);
		}
		
		sc_super();
	}

});
