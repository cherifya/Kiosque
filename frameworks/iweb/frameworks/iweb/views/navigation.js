// ==========================================================================
// Project:   IWeb.NavigationView
// Copyright: ©2011 Strobe, Inc.
// ==========================================================================
/*globals Iweb */

/** @class

  Wrapper class around the excellent SC.NavigationView. 
  When a view is pushed in and its topToolbqr property is not present 
  this subclass automatically adds a back button with the title
	of the previous view in the stack as label. If you don't want this
	default button, set the leftBarView attribute of the toolbar class
	you're providing to your custom view.
	
	To load view by default, set the rootView property.

  @author Cherif Yaya
  @extends SC.View
*/
Iweb.NavigationView = SC.View.extend(
/** @scope IWeb.NavigationView.prototype */ {
  /**
    Default view loaded by default. This is the root view of the hierarchy
    
    @type SC.View
    @default null
  */
	rootView: null,
	
	/**
    If YES, then the previous view in the stack will be displayed on the left
    along the current view when a landscape orientation is detected.
    
    *Experimental*
    
    @type Boolean
    @default NO
  */
	masterDetailOnLandscape: NO,
	
	/**
    Tracks the orientation of the view. Possible values:
    
      - SC.HORIZONTAL_ORIENTATION
      - SC.PORTRAIT_ORIENTATION
    
    @field
    @type String
    @default SC.HORIZONTAL_ORIENTATION
  */
  orientation: function() {
    var f = this.get("frame");
    if (f.width > f.height) return SC.HORIZONTAL_ORIENTATION;
    else return SC.VERTICAL_ORIENTATION;
  }.property("frame").cacheable(),
	
	/**
	 Pushes a view into the navigation view stack. The view may have topToolbar and bottomToolbar properties.
	 
	 @param {SC.View} view View to be pushed on the view stack 
	*/
	push: function(view){
	  if (this.navigationView) this.navigationView.push(view);
	  if (this.masterDetailOnLandscape) this.invokeOnce('updateDisplayedViews');
	},
	
	/**
	 Pops the current view off the navigation view stack.
	 
	 @returns {SC.View}
	*/
	pop: function(){
	  if (this.navigationView) return this.navigationView.pop();
	  if (this.masterDetailOnLandscape) this.invokeOnce('updateDisplayedViews');
	},
	
	/**
	 Pops to the specified view on the navigation view stack; the view you pass will become the current view.
	 
	 @param {SC.View} view View to be pushed on the view stack 
	*/
	popToView: function(view){
	  if (this.navigationView) this.navigationView.popToView(view);
	  if (this.masterDetailOnLandscape) this.invokeOnce('updateDisplayedViews');
	},
	
	
	/** @private */
	init: function() {
		sc_super();
		
		var rootView = this.get('rootView');
		if(!SC.none(rootView)) {
			if(rootView.isClass) {
				rootView = this.createChildView(rootView);
				this.set('rootView',rootView);
			}
			if (this.navigationView) this.navigationView.push(rootView);
		}
	},
	
	/** @private */
	childViews: 'navigationView masterContainer'.w(),
	
	/** @private */
	masterContainer: SC.ContainerView.design({
	  layout: {top:0,right:0,bottom:0,left:0 },
	  isVisible: NO
	}),
	
	/** @private 
	*/
	orientationDidChange: function() {
	  var orientation = this.get('orientation'),
	      masterDetailOnLandscape = this.get('masterDetailOnLandscape');
	      
	  if (orientation == SC.HORIZONTAL_ORIENTATION && masterDetailOnLandscape) this.setIfChanged('masterIsHidden',NO);
	  else  this.setIfChanged('masterIsHidden',YES);
	}.observes('orientation', 'masterDetailOnLandscape'),
	
	/** @private */
	masterIsHiddenDidChange: function() {
	  var masterIsHidden = this.get('masterIsHidden');
	      
	  if (masterIsHidden) {
	    //hides master view 
	    this.masterContainer.set('isVisible', NO);    
	    
	    //adjust the navation width back to the total width
	    this.navigationView.set('layout', {left: 0, right:0, top: 0, bottom:0 });
	  }
	  else {
	    //display master container and resize navigationView
	    //according to a 1/3 - 2/3 proportion
	    var f = this.get('frame');
	    var masterWidth = Math.floor(f.width/3),
	        detailWidth = Math.floor(f.width*2/3);
	      
	    //make sure the master container is visible and adjust its width
	    this.masterContainer.set('isVisible',YES);    
	    this.masterContainer.set('layout', {top: 0, bottom: 0, left: 0, width: masterWidth});
	    
	    //adjust the navation width to be 2/3 of the total width
	    this.navigationView.set('layout', {width: detailWidth, right:0, top: 0, bottom:0 });
	  }
	  
	  this.updateDisplayedViews(masterIsHidden);
	  
	}.observes('masterIsHidden'),
	
	updateDisplayedViews: function() {
	  var masterIsHidden = this.get('masterIsHidden');
	  var leftView, rightView;
	  var stack = this.navigationView._views;
	  
	  var currentView, previousView;
	  
	  if (masterIsHidden) {
	    //when hiding master container
	    //update navigation view with master view if no current view defined
	    currentView = this.navigationView._current;
	    if (SC.none(currentView)) {
	      
	      currentView = this.getPath('masterContainer.contentView');
	      this.masterContainer.removeChild(currentView);
	      this.navigationView.push(currentView);
      }
	    
	  }
	  else {
	    //when showing master, display the previous view in the master container
	    //if no previous view, display the current view (which is the root view)
	    //in the master container. the detail view will be empty
	    currentView = this.navigationView._current;
	    previousView = null;
	    if (stack.length > 0) previousView = stack[stack.length -1];
	    
	    if (!SC.none(previousView)) {
	      this.masterContainer.set('contentView',previousView);
	    }
	    else {
	      //no previous view in the stack. use the current view in the master container
	      this.navigationView.pop();
	      
	      this.masterContainer.set('contentView',currentView); 
	    }
	  }
	  
	},
	
	/** @private */
	navigationView: SC.NavigationView.design({
	  layout: {top: 0, left: 0, bottom: 0, right: 0},
	  
	  /** @private 
	    Overriden to add a back button if none provided
	  */
    topToolbarDidChange: function() {
  		var topToolbar = this.get('topToolbar');

  		var views = this._views;


  		//add back button if no leftBarView provided
  		if(topToolbar && !topToolbar.get('leftBarView') && views.length >= 1) {
  			var previousView = views[views.length-1];
  			//make sure title is not empty or undefined 
  			var title = SC.empty(previousView.title) ? 'Back' : previousView.title;

  			var leftButton = SC.ButtonView.create({
  			  layout: { left: 10, width: 90, top: 6 },
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
	})

});
