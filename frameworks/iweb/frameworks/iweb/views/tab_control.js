// ==========================================================================
// Project:   Iweb.TabControlView
// Copyright: ©2011 Strobe, Inc.
// ==========================================================================
/*globals Iweb */

Iweb.TabBarItem = SC.Object.extend({
	title: null,
	view: null,
	image: null
});

Iweb.IPHONE_TAB_BAR_SIZE = 44;
Iweb.IPAD_TAB_BAR_SIZE = 22;

/** @class

  Tab control class. It allows to display a set of views
	in a tab like fashion with a tab bar at the bottom.
  
  @author Cherif Yaya
  @extends SC.View
*/
Iweb.TabControlView = SC.View.extend(
/** @scope Iweb.TabControlView.prototype */ {
	tabs: [],
	
	nowShowing: null,
	
	isTabBarVisible: YES,
	transitionDuration: 250,
	
	tabBarHeight: function() {
	  if (SC.browser.iPhone || SC.browser.iPod) return Iweb.IPHONE_TAB_BAR_SIZE;
	  else return Iweb.IPAD_TAB_BAR_SIZE;
	}.property().cacheable(),
	
	tabBarAnchor: function() {
	  if (SC.browser.iPhone || SC.browser.iPod) return SC.ANCHOR_BOTTOM;
	  else return SC.ANCHOR_TOP;
	}.property().cacheable(),
	
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
		
		var tabBarItem = tab.get('tabBarItem') || SC.Object.create() ;
		//tabBarItem = SC.Object.create(tabBarItem) ;
		
		
		var customName = tabBarItem.get('tag') || tabName;
		this.set(customName, tab);
		//map tab name to tab index
		this._tabNames[customName] = this._tabCount;
		
		//by default push the view totally to the right
		var leftValue = (frame.width * this._tabCount) ;
		tab.set('layout',{top: 0, bottom: 0, left: leftValue, width: frame.width });
		
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
	},
	
	navigateToTab: function(index) {
	  //if name of tab passed, map to tab Index
	  if (SC.typeOf(index) == SC.T_STRING) index  = this._tabNames[index] ;
	  if (SC.none(index)) return ;
	  
	  var nbTabs = this._tabViews.length ;
	  
	  //normalize index
	  if (index < 0) index = 0 ;
	  else if (index >= nbTabs) index = nbTabs - 1 ;
	  
		var frame = this.get('frame') ;
		
		//navigate to tab view
		for(var i = 0; i < nbTabs; i++) {
			var view = this._tabViews[i] ;
			var delta = view.tabIndex - index ;
			
			//hide invisible tabs
			if(delta !== 0) view.$().addClass('tab-hidden') ;
			else view.$().removeClass('tab-hidden') ;
			
			//notify view that it's about to become the front tab
			if(delta === 0 && view.willBecomeFrontTab)	view.willBecomeFrontTab() ;
			
			var transitionDuration = this.get('transitionDuration') ;
			if (SC.none(transitionDuration)) transitionDuration = 250 ;
			transitionDuration = transitionDuration * 1.0 / 1000;  //convert in seconds for animate()
			
			view.animate('left', (delta * frame.width), {
			  duration: transitionDuration
			});
			
			
			//notify view that it's become the front tab
			if(delta === 0 && view.didBecomeFrontTab)	{
				var timer = SC.Timer.schedule({
	          target:   view,
	          action:   'didBecomeFrontTab',
	          interval: 350,
	          repeats:  NO
	      });
			}
			
		}
		
		//make the corresponding tab item the current
		for(i = 0; i < this._tabBarItems.length; i++) {
			var item = this._tabBarItems[i] ;
		 	item.$().addClass('current-tab',(item.tabIndex == index)) ;
		}
		
		//save current Indexes
		this.set("currentTabIndex", index) ;
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
  init: function() {
		sc_super();
		
		//create initial tabs
		for(var i = 0; i < this.tabs.length; i++) {
			var tab = this.tabs[i] ;
			this.addTab(tab) ;
		}
		
		var nowShowing = this.get('nowShowing') ;
		if (!SC.empty(nowShowing)) this.navigateToTab(nowShowing) ;		
	},
	
	/** @private */
	nowShowingDidChange: function() {
	  var nowShowing = this.get('nowShowing') ;
		if (!SC.empty(nowShowing)) this.navigateToTab(nowShowing) ;
	}.observes('nowShowing'),
	
	/** private */
	classNames: 'sc-tab-control'.w(),
	
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
		for(var i = 0; i < this._tabViews.length; i++) {
			var view = this._tabViews[i] ;
			var delta = view.tabIndex - index ;
			
			view.adjust({left: (delta * frame.width), width: frame.width}) ;
			
		}
		
		//reset tab items layouts
		this._positionTabBarItems() ;
	}.observes('frame'),
	
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
		
		//create the tab bar
		var tabBar = this.createChildView(
		  SC.View.design({
		    classNames: 'sc-tab-bar-view'.w()
		  })
		) ;
		childViews.push(tabBar) ;
		this.set('tabBar',tabBar) ;
		
		this.set('childViews', childViews) ;
		
		this._positionContainers() ;
	},
	
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
	
	touchStart: function(touch) {
	  this._touch = {
	    start: {x: touch.pageX, y: touch.pageY}
	  };
	  return YES;
	},
	
	touchesDragged: function(evt, touches) {
	  var t = this._touch;
	  
	  var deltaX = evt.pageX - t.start.x;
	  console.log('deltaX: '+ deltaX) ;
    
    this._flick(deltaX);
	},
	
	touchEnd: function(touch) {
	  var t = this._touch;
	  
	  var deltaX = touch.pageX - t.start.x;
	  var deltaY = touch.pageY - t.start.y;
	  
	  var frame = this.get('frame');
	  
	  if (Math.abs(deltaX) >= (frame.width/2)) {
	    //tabs have flicked
	    if (deltaX > 0) {
	      //move right
	      this.navigateToTab(this.currentTabIndex + 1) ;
	    }
	    else {
	      //move left
	      this.navigateToTab(this.currentTabIndex - 1) ;
	    }
	  }
	  else {
	    //no tab moved. snap back
	    this.navigateToTab(this.currentTabIndex) ;
	  }
	},
	
	_flick: function(deltaX) {
	  for(var i = 0; i < this._tabViews.length; i++) {
			var view = this._tabViews[i] ;
			
			var f = view.get('frame') ;
			view.adjust({left: (f.x + deltaX) });
			
		}
	}

});
