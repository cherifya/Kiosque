// ==========================================================================
// Project:   Tab.TabView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Iweb */
sc_require('views/i_scene');

Iweb.ITabBarItem = SC.Object.extend({
	title: null,
	view: null,
	image: null
});

/** @class

  Iphone like tab control class. It allows to display a set of views
	in a tab like fashion with a tab bar at the bottom.

  @extends SC.View
*/
Iweb.ITabView = SC.View.extend(
/** @scope IWeb.TabView.prototype */ {
	tabViews: [],
	classNames: 'i-tab-control'.w(),
	nowShowing: null,

  init: function() {
		sc_super();
		
		this.nowShowingDidChange();		
	},
	
	createChildViews: function() {
		var childViews = [], view ;

		//Add the scene view
    view = this.createChildView(
      SC.SceneView.design({
		    layout: { top: 0, right: 0, bottom: 44, left: 0 },
		    transitionDuration: 200,
				tabControl: this,
				
				//override so that it looks for view directly in the object instead of the mainPage
				nowShowingDidChange: function() {
			    // This code turns this.nowShowing into a view object by any means necessary.

			    var content = this.get('nowShowing') ;

			    // If nowShowing was changed because the content was set directly, then do nothing.
			    if (content === SC.CONTENT_SET_DIRECTLY) return ;

			    // If it's a string, try to turn it into the object it references...
			    if (SC.typeOf(content) === SC.T_STRING && content.length > 0) {
			      if (content.indexOf('.') > 0) {
			        content = SC.objectForPropertyPath(content);
			      } else {
			        content = SC.objectForPropertyPath(content, this);
			      }
			    }

			    // If it's an uninstantiated view, then attempt to instantiate it.
			    // (Uninstantiated views have a create() method; instantiated ones do not.)
			    if (SC.typeOf(content) === SC.T_CLASS) content = content.create();

			    // If content has not been turned into a view by now, it's hopeless.
			    if (content && !(content instanceof SC.View)) content = null;

			    // Sets the content.
			    this.set('contentView', content) ;

			  }.observes('nowShowing')
		  })
    );
    childViews.push(view) ;
		this.set('sceneView', view) ;
		
		//add tab bar view
		view = this.createChildView(
			SC.View.design({
			  layout: { right: 0, bottom: 0, left: 0, height: 44 },
			  childViews: ''.w(),
				classNames: 'i-tab-bar'.w(),
				tabControl: this
			})
		);
		childViews.push(view) ;
		this.set('tabBarView', view) ;
		
		this.set('childViews', childViews) ;
		
		
		//add tab views and create tab bar items
		var sceneView = this.get('sceneView');
		var tabBarView = this.get('tabBarView');
		
		var tabViews = this.get('tabViews');
		
		var nbTabs = tabViews.length;
		var tabWidth = tabBarView.get('frame');
		tabWidth = tabWidth.width/nbTabs;
		
		for(var idx=0; idx<tabViews.length; idx++) {
			var customName = tabViews[idx];
			var customView = this.get(tabViews[idx]);
			// instantiate if needed
	    if (customView.isClass) customView = sceneView.createChildView(customView) ;
			sceneView.set(customName, customView);
			
			var tabItem = customView.get('tabBarItem') || SC.Object.create();
			
			//create tab bar item
			var tabItemView = tabBarView.createChildView(
				SC.View.design({
			  	layout: { top: 0, bottom: 0, left: idx*tabWidth, width: tabWidth },
				  childViews: 'imageView titleView'.w(),
					classNames: 'i-tab-bar-item'.w(),
					tabName: customName,
					tabControl: this,
					tabIndex: idx,
					nbTabs: nbTabs,
					isCurrentTab: NO,
					
					parentViewDidResize: function() {
						var width = this.parentView.get('frame');
						if (width) width = width.width;
						if (!width) return;
						var nbTabs = this.nbTabs;
						if (!nbTabs) return;
						var tabWidth = Math.floor(width/nbTabs);
						var idx = this.tabIndex;
						
						this.set('layout',{ top: 0, bottom: 0, left: idx*tabWidth, width: tabWidth });
						
						sc_super();
					},
					
					render: function(context, firstTime) {
						sc_super();
						if (this.get('isCurrentTab')) context.addClass('i-tab-bar-item-active') ;
						else context.removeClass('i-tab-bar-item-active') ;
					},
					
					isCurrentTabDidChange: function() {
						//update layer rendering
						this.set('layerNeedsUpdate',YES);
					}.observes('isCurrentTab'),
				
					imageView: SC.ImageView.design({
						useStaticLayout: YES,
					  layout: { centerX: 0, top: 0, width:30, height:30 },
					  value: tabItem.get('image'),
					}),
				
					titleView: SC.LabelView.design({
					  layout: { bottom: 0, right: 0, height: 14, left: 0 },
					  value: tabItem.get('title'),
						textAlign: SC.ALIGN_CENTER,
						controlSize: SC.SMALL_CONTROL_SIZE,
						fontWeight: SC.BOLD_WEIGHT
					}),
				
					mouseDown: function(evt) {
						this.touchStart(evt) ;
					},
				
					mouseUp: function(evt) {
						this.touchEnd(evt) ;
					},
					
					touchStart: function(touch) {
						return YES ;
					},
					
					touchEnd: function(touch) {
						var tabName = this.get('tabName');
						
						//show the new tab
						this.get('tabControl').set('nowShowing',tabName) ;
					}
				})
			);
			
			tabBarView.appendChild(tabItemView) ;
		}
		sceneView.set('scenes',tabViews) ;
		sceneView.set('nowShowing',tabViews[0]) ;
	},
	
	_clearActiveForShowingTabs : function(nowShowing) {
		for(var idx=0; idx<this.get('tabBarView').childViews.length; idx++) {
			var view = this.get('tabBarView').childViews[idx] ;
			if(view.get('tabName') != nowShowing)	view.set('isCurrentTab', NO);
			else view.set('isCurrentTab',YES);
		}
	},
	
	nowShowingDidChange: function() {
		var view = this.sceneView.get(this.get('nowShowing'));
		
		//didBecomeFrontTab and willBecomeFrontTab present, call them
		if (view && view.willBecomeFrontTab) view.willBecomeFrontTab();
		
		//relay to scene view
		this.get('sceneView').set('nowShowing',this.get('nowShowing'));
		
		if (view && view.didBecomeFrontTab) view.didBecomeFrontTab();
		
		//make tab the current one
		this._clearActiveForShowingTabs(this.get('nowShowing')) ;
		
		
	}.observes('nowShowing'),

});
