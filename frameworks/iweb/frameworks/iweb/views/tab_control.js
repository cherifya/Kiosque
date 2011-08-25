// ==========================================================================
// Project:   Iweb.TabControlView
// Copyright: ©2011 Strobe, Inc.
// ==========================================================================
/*globals Iweb */

/** @class

  Tab control class. It allows to display a set of views
	in a tab like fashion with a tab bar at the bottom.
  
  @author Cherif Yaya
  @extends SC.View
*/
Iweb.TabBarItem = SC.Object.extend({
	title: null,
	view: null,
	image: null
});

Iweb.IPHONE_TAB_BAR_SIZE = 44;
Iweb.IPAD_TAB_BAR_SIZE = 24;

/** @class

  Tab control class. It allows to display a set of views
	in a tab like fashion with a tab bar at the bottom.
  
  @author Cherif Yaya
  @extends SC.View
*/
Iweb.TabControlView = SC.View.extend(
/** @scope Iweb.TabControlView.prototype */ {
  
  /**
    Array containing path of views to be initially loaded as tabs at loading time. 
    The path can be absolute or relative. In the latter case, they should be defined in the tab control view object itself.
    More tabs can be added at runtime using the TabControlView#addTab method.
    @type {Array}
    @default Empty Array
  */
	tabs: [],
	
	/**
    Currently showing tab name. Setting this value results in the control navigating
    to the tab with the new name (if any).
    
    @type {String}
    @default null
  */
	nowShowing: null,
	
	/**
    If YES, tab bar is displayed. Else, it is hidden.
    
    @type {Boolean}
    @default YES
  */
	isTabBarVisible: YES,
	
	/**
    Duration of tab change animation.
    
    @type {Number}
    @default 250
  */
	transitionDuration: 250,
	
	/**
    If YES, user can navigate between tabs by flicking horizontally on the screen.
    
    @type {Boolean}
    @default YES
  */
	flickToNavigate: YES,
	
	/**
    Percentage of the width of the control for navigating to next (or previous) tab.
    By playing with this value, different flicking behaviours can be achieved.
    
    @type {Number}
    @default 0.4
  */
	flickingThreshold: 0.4,
	
	/**
    Spacing used to separate tabs when flicking else they would be stashed together.
    
    @type {Number}
    @default 10
  */
	flickingSpacing: 10,
	
	/**
    View to use as container for the tab bar items
    
    @type SC.View
    @default Custom view for iPhone and iPad
  */
	tabBarView: function() {
    var view = null ;
	  if (SC.browser.iPhone || SC.browser.iPod) {
	    view = SC.View.design({
  	    classNames: 'sc-tab-bar-view iphone'.w()
  	  }) ;
    }
	  else {
	    view = SC.View.design({
  	    classNames: 'sc-tab-bar-view ipad'.w()
  	  }) ;
  	  return view ;
	  }
	}.property(),
	
	/**
    Height of the tab bar in pixels
    
    @type {Number}
    @default 44 for iPhone and 24 for iPad
  */
	tabBarHeight: function() {
	  if (SC.browser.iPhone || SC.browser.iPod) return Iweb.IPHONE_TAB_BAR_SIZE;
	  else return Iweb.IPAD_TAB_BAR_SIZE;
	}.property().cacheable(),
	
	/**
    Anchor position for the tab bar. Either SC.ANCHOR_TOP or SC.ANCHOR_BOTTOM
    
    @type {String}
    @default SC.ANCHOR_BOTTOM for iPhone sized devices. SC.ANCHOR_TOP otherwise (including iPad)
  */
	tabBarAnchor: function() {
	  if (SC.browser.iPhone || SC.browser.iPod) return SC.ANCHOR_BOTTOM;
	  else return SC.ANCHOR_TOP;
	}.property().cacheable(),
	
	/**
	 Add the passed view as a new tab. The tab is added after all existing tabs.
	 
	 @param {SC.View} tab View to be added as a new tab 
	*/
	addTab: function(tab) {
	  if (SC.none(tab)) return;
		var container = this.get('tabContainer') ;
		var tabBar = this.get('tabBar') ;
		
		var tabController = this ;
		
		var frame = this.get('frame') ;
		
		var tabCount = this._tabCount;
		var tabName = null;
		
		//if passed the tab name, read the view in the current object
		if (SC.typeOf(tab) === SC.T_STRING) {
		  tabName = tab;
		  if (tab.indexOf('.') > 0) {
        tab = SC.objectForPropertyPath(tab);
      } else {
        tab = SC.objectForPropertyPath(tab, this);
      }
		}
		
		// instantiate if needed
		if (tab.isClass) tab = container.createChildView(tab, {tabIndex: tabCount}) ;
		
		//append to parent
    container.appendChild(tab) ;
		
		/*
		var transitionDuration = this.get('transitionDuration') ;
		if (SC.none(transitionDuration)) transitionDuration = 250 ;
		transitionDuration = transitionDuration * 1.0 / 1000;  //convert in seconds for animate()
		//set up css transition on new tab view
		tab.$().css('-webkit-transition-property', '-webkit-transform')
		        .css('-webkit-transition-duration', '%@s'.fmt(transitionDuration)) ;
		        
		*/      
		
		var tabBarItem = tab.get('tabBarItem') || SC.Object.create() ;
		//tabBarItem = SC.Object.create(tabBarItem) ;
		
		
		var customName = tabBarItem.get('tag') || tabName;
		this.set(customName, tab);
		//map tab name to tab index
		this._tabNames[customName] = this._tabCount;
		
		//by default push the view totally to the right
		var leftValue = (frame.width * this._tabCount) ;
		tab.set('layout',{top: 0, bottom: 0, left: 0, right: 0 });//left: leftValue, width: frame.width });
		
		this._tabViews.push(tab) ;
		
		
		//create tab bar item
		var tabBarWidth = frame.width / (tabCount + 1) ;
		var tabItem = tabBar.createChildView(
		  SC.View.design({
		    layout: {top:0, bottom:0, left: tabBarWidth * this._tabCount, width: tabBarWidth},
  			title: tabBarItem.title,
  			targetView: tab,
  			tabIndex: this._tabCount,
  			tabControl: this,
  			
  			click: function() {
  				this.goToTab() ;
  			},
  			
  			touchStart: function(touch) {
  			  return YES;
  			},
  			
  			touchEnd: function(touch) {
  			  this.goToTab() ;
  			},
  			
  			goToTab: function() {
  			  tabController.navigateToTab(this.tabIndex) ;
  			},

  			childViews: 'label'.w(),
  			label: SC.LabelView.design({
  			  layout: {top:0, bottom:0, right: 0, bottom: 0},
  			  value: tabBarItem.title,
  			  textAlign: SC.ALIGN_CENTER
  			}),
  			classNames: 'sc-tab-bar-item-view'.w()
  		})
		);
		tabBar.appendChild(tabItem) ;
		//tabItem.setStyle( { top: (this.get('tabHeight')-13)+'px'}) ;
		this._tabBarItems.push(tabItem) ;
		
		this._positionTabBarItems();
		
		//increment tab count
		this._tabCount++ ;
		
		//position tab views to set translate offsets
		this.invokeLater('_positionTabViews') ;
		
		//return tab
		//in case it were instantiated here the caller might need the actual view object
		return tab ;
	},
	
	
	/**
	 Remove the passed view from tabs.
	 
	 @param {Number|String} tab View to be added as a new tab 
	*/
	removeTab: function(index) {
	  throw "RemoveTab() not implemented yet" ;
	},
	
	/**
	 Make the tab with the passed index the currently showing tab.
	 The index represents the order in which the tabs have been added to the tab control view.
	 
	 @param {Number|String} index Index of tab to navigate to. 
	*/
	navigateToTab: function(index) {
	  //if name of tab passed, map to tab Index
	  if (SC.typeOf(index) == SC.T_STRING) index  = this._tabNames[index] ;
	  if (SC.none(index)) return ;
	  
	  var nbTabs = this._tabViews.get('length') ;
	  //if no tab existing, nowhere to navigate to
	  if (nbTabs === 0) return ;
    
	  //normalize index
	  if (index < 0) index = 0 ;
	  else if (index >= nbTabs) index = nbTabs - 1 ;
	  
		var frame = this.get('frame') ;
		var transitionDuration = this.get('transitionDuration') ;
		
		//navigate to tab view
		for(var i = 0; i < nbTabs; i++) {
			var view = this._tabViews[i] ;
			var delta = view.tabIndex - index ;
			
			//hide invisible tabs
			if(delta !== 0) view.$().addClass('tab-hidden') ;
			else view.$().removeClass('tab-hidden') ;
			
			//notify view that it's about to become the front tab
			if(delta === 0 && view.willBecomeFrontTab)	view.willBecomeFrontTab() ;
			
			//reset CSS transforms on view
			var sTranslate = 'translateX(%@px)'.fmt(delta * frame.width) ;
			view.$().css({'-webkit-transform': sTranslate, '-moz-transform': sTranslate}) ;
			
			//view.animate('left', (delta * frame.width), {
			//  duration: transitionDuration
			//});
			
			
			//notify view that it's become the front tab
			if(delta === 0 && view.didBecomeFrontTab)	{
				var timer = SC.Timer.schedule({
	          target:   view,
	          action:   'didBecomeFrontTab',
	          interval: transitionDuration,
	          repeats:  NO
	      });
			}
			
		}
		
		//make the corresponding tab item the current
		for(i = 0; i < this._tabBarItems.length; i++) {
			var item = this._tabBarItems[i] ;
		 	item.$().setClass('active',(item.tabIndex === index)) ;
		}
		
		//save current Indexes
		this.setIfChanged("currentTabIndex", index) ;
	},
	
	/** @private */
	_tabViews: [],
	
	/** @private */
	_tabBarItems: [],
	
	/** @private */
	_tabCount: 0,
	
	/** @private */
	_tabNames: {},
	
	/** @private */
	currentTabIndex: 0,

  /** @private */
  init: function() {
		sc_super();
		
		//create initial tabs
		for(var i = 0; i < this.tabs.length; i++) {
			var tab = this.tabs[i] ;
			this.addTab(tab) ;
		}
		
		var nowShowing = this.get('nowShowing') ;
		if (!SC.empty(nowShowing)) this.navigateToTab(nowShowing) ;
		else this.navigateToTab(0) ;		
	},
	
	/** @private */
	nowShowingDidChange: function() {
	  var nowShowing = this.get('nowShowing') ;
		if (!SC.empty(nowShowing)) this.navigateToTab(nowShowing) ;
	}.observes('nowShowing'),
	
	/** private */
	classNames: 'sc-tab-control-view'.w(),
	
	/** @private */
	createChildViews: function() {
		var childViews = [], view ;
		
		this._createContainers() ;
	},
	
	/** @private */
	frameDidChange: function() {
	  //reset tabs width and position
	  var index = this.currentTabIndex ;
	  var frame = this.get('frame') ;
	  //SC.Logger.log('frame %@'.fmt(frame.width)) ;
		for(var i = 0; i < this._tabViews.length; i++) {
			var view = this._tabViews[i] ;
			var delta = view.tabIndex - index ;
			
			view.adjust({left: (delta * frame.width), width: frame.width}) ;
			
		}
		
		//reset tab items layouts
		this._positionTabBarItems() ;
	}.observes('frame'),
	
	/** @private */
	isTabBarVisibleDidChange: function() {
	  this._positionContainers() ;  
	}.observes('isTabBarVisible'),
	
	/** @private */
	_createContainers: function() {
	  var childViews = [], view ;
		
		//create the view that contains each tab view
		var container = this.createChildView(
		  SC.View.design({
		    classNames: 'sc-tab-container-view'.w()
		  })
		) ;
		childViews.push(container) ;
		this.set('tabContainer',container) ;
		
		var tabBarView = this.get('tabBarView') ;
		
		//create the tab bar
		var tabBar = this.createChildView(tabBarView) ;
		childViews.push(tabBar) ;
		this.set('tabBar',tabBar) ;
		
		this.set('childViews', childViews) ;
		
		this._positionContainers() ;
	},
	
	/** @private */
	_positionContainers: function() {
		var container = this.get('tabContainer') ;
		var tabBar = this.get('tabBar') ;
		
		var containerLayout = SC.Object.create({left: 0, right: 0}) ;
		var tabBarLayout = SC.Object.create({left: 0, right: 0}) ;
		
		var tabBarVisible = this.get('isTabBarVisible');
		var tabBarAnchor = this.get('tabBarAnchor') ;
		var tabBarHeight = this.get('tabBarHeight') ;
		
		var frame = this.get('frame') ;
		
		if (tabBarVisible) {
		  if(tabBarAnchor == SC.ANCHOR_TOP) {
  			tabBarLayout.mixin({top: 0, height: tabBarHeight}) ;
  			containerLayout.mixin({top: tabBarHeight, bottom: 0}) ;
  		}
  		else if(tabBarAnchor == SC.ANCHOR_BOTTOM) {
  			tabBarLayout.mixin({bottom: 0, height: tabBarHeight}) ;
  			containerLayout.mixin({top: 0, bottom: tabBarHeight}) ;
  		}
		}	
		else {
		  containerLayout.mixin({top: 0, bottom: 0}) ;
		  tabBarLayout.mixin({top: 0, height: 0}) ;
		  tabBar.set('isVisible', NO) ;
		}
		
		//apply layouts
		container.set('layout', containerLayout) ;
		tabBar.set('layout', tabBarLayout) ;
		
	},
	
	/** @private */
	_positionTabBarItems: function() {
	  var frame = this.get('frame') ;
	  var nbTabs = this._tabBarItems.length;
	  var tabBarWidth = frame.width / (nbTabs) ;
	  for(var i = 0; i < nbTabs; i++) {
			var item = this._tabBarItems[i] ;
			item.set('layout', {top:0, bottom:0, left: tabBarWidth * i, width: tabBarWidth}) ;
		}
	  
	},
	
	/** @private */
	_positionTabViews: function() {
	  var currentTabIndex = this.get('currentTabIndex') ;
	  var frame = this.get('frame') ;
	  for(var i = 0; i < this._tabViews.length; i++) {
	    var view = this._tabViews[i] ;
			var delta = view.tabIndex - currentTabIndex ;
			
			//hide invisible tabs
			if(delta !== 0) view.$().addClass('tab-hidden') ;
			else view.$().removeClass('tab-hidden') ;
			
			var transitionDuration = this.get('transitionDuration') ;
			if (SC.none(transitionDuration)) transitionDuration = 250 ;
			transitionDuration = transitionDuration * 1.0 / 1000;  //convert in seconds for animate()
			
			//set up view to animate translateX change
			view.$().css('-webkit-transition-property', '-webkit-transform')
			       .css('-webkit-transition-duration', '%@s'.fmt(transitionDuration)) ;
			
			//reset CSS transforms on view
			var sTranslate = 'translateX(%@px)'.fmt(delta * frame.width) ;
			view.$().css({'-webkit-transform': sTranslate, '-moz-transform': sTranslate}) ;
		}
	},
	
	/** @private */
	captureTouch: function() {
	  return YES ;
	},
	
	/** @private */
	touchStart: function(touch) {
	  this._touch = {
	    start: {x: touch.pageX, y: touch.pageY}
	  } ;
	  
	  if (this.get('flickToNavigate')) {
	    this._hasTouch = touch ;
	    //remove css transition so that flicking with the finger does not animate
	    this._deactivateCssTransitionForCurrentTabs() ;
	    //in 0.5 sec we'll pass the touch along
	    this.invokeLater('beginContentTouches', 10, touch) ;
	    return YES ;
    }
	  else return NO ;
	},
	
	/** @private */
	beginContentTouches: function(touch) {
	  if (touch === this._hasTouch) {
	    //pass it along
	    touch.captureTouch(this, YES) ;
	  }
	},
	
	/** @private */
	touchesDragged: function(evt, touches) {
	  var t = this._touch;
	  
	  var deltaX = evt.pageX - t.start.x;
	  
    //flick tabs
    this._flick(deltaX);
	},
	
	/** @private */
	touchCancelled: function(touch) {
	  this.touchEnd(touch) ;
  },
	
	/** @private */
	touchEnd: function(touch) {
	  var t = this._touch;
	  
	  var deltaX = touch.pageX - t.start.x ;
	  var deltaY = touch.pageY - t.start.y ;
	  
	  var frame = this.get('frame') ;
	  var threshold = this.get('flickingThreshold') ;
	  
	  //restore css transitions animations
	  this._activateCssTransitionForCurrentTabs() ;
	  
	  //depending on the distance of the touch, navigate to previous/next tab
	  //or do nothing 
	  if (Math.abs(deltaX) >= (frame.width * threshold)) {
	    //tabs have flicked
	    if (deltaX > 0) {
	      //move left
	      this.navigateToTab(this.currentTabIndex - 1) ;
	    }
	    else {
	      //move right
	      this.navigateToTab(this.currentTabIndex + 1) ;
	    }
	  }
	  else {
	    //no tab moved. snap back
	    this.navigateToTab(this.currentTabIndex) ;
	  }
	  
	  //clean up
    delete this._touch ;
	  this._touch = null ;
	  delete this._hasTouch ;
	  this._hasTouch = null ;
	},
	
	/** @private */
	_deactivateCssTransitionForCurrentTabs: function() {
	  var currentTabIndex = this.get('currentTabIndex') ;
	  for(var i = currentTabIndex - 1; i < this._tabViews.length && i <= currentTabIndex + 1; i++) {
	    if (i < 0) continue ;
			var view = this._tabViews[i] ;
			view.$().css('-webkit-transition-property', 'none') ;
		}
	},
	
	/** @private */
	_activateCssTransitionForCurrentTabs: function() {
	  var currentTabIndex = this.get('currentTabIndex') ;
	  
	  var transitionDuration = this.get('transitionDuration') ;
		if (SC.none(transitionDuration)) transitionDuration = 350 ;
		transitionDuration = transitionDuration * 1.0 / 1000;  //convert in seconds for animate()
		
	  for(var i = currentTabIndex - 1; i < this._tabViews.length && i <= currentTabIndex + 1; i++) {
	    if (i < 0) continue ;
			var view = this._tabViews[i] ;
			view.$().css('-webkit-transition-property', '-webkit-transform')
			       .css('-webkit-transition-duration', '%@s'.fmt(transitionDuration)) ;
		}
	},
	
	/** @private */
	_flick: function(deltaX) {
	  //translate all tabs by the given delta
	  var currentTabIndex = this.currentTabIndex ;
	  var frame = this.get('frame') ;
	  var spacing = this.get('flickingSpacing') ;
	  for(var i = currentTabIndex - 1; i < this._tabViews.length && i <= currentTabIndex + 1; i++) {
	    if (i < 0) continue ;
			var view = this._tabViews[i] ;
			var indexDelta = view.tabIndex - currentTabIndex ;
			
			var defaultX = indexDelta * frame.width ;
			var translateOffset = indexDelta === 0 ? defaultX + deltaX : defaultX + deltaX + (spacing * indexDelta) ;
			//SC.Logger.debug('view %@:%@'.fmt(indexDelta, view.get('layoutStyle')));
			var sTranslate = 'translateX(%@px)'.fmt(translateOffset) ;
			view.$().css({'-webkit-transform': sTranslate, '-moz-transform': sTranslate}) ;
			
		}
	}

});
