// ==========================================================================
// Project:   Oritide.ImageButtonView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  (Document Your View Here)

  @extends SC.ImageView
*/
Kiosque.ImageButtonView = SC.ImageView.extend(
/** @scope Oritide.ImageButtonView.prototype */ {

  action: null,	
	target: null,
	isActive: NO,
	isEnabled: YES,
	
	init: function() {
		sc_super();
		
		this.isEnabledChange();
	},
	
	render: function(context, firstTime) {
		sc_super();
		if (this.get('isActive')) context.addClass('button-active') ;
		else context.removeClass('button-active') ;
		
		if (!this.get('isEnabled')) context.addClass('button-disabled') ;
		else context.removeClass('button-disabled') ;
	},
	
	isActiveChange: function() {
		//update layer rendering
		this.set('layerNeedsUpdate',YES);
	}.observes('isActive'),
	
	isEnabledChange: function() {
		//update layer rendering
		this.set('layerNeedsUpdate',YES);
	}.observes('isEnabled'),
	
	mouseDown: function(evt) {
		this.touchStart(evt) ;
	},

	mouseUp: function(evt) {
		this.touchEnd(evt) ;
	},
	
	touchStart: function(touch) {
		this.set('isActive', YES);
		
		return YES ;
	},
	
	touchEnd: function(touch) {
		this.set('isActive', NO);
		//call action if enabled
		if (this.get('isEnabled')) this._runAction();
	},
	
	_runAction: function() {
		var action = this.get('action'),
        target = this.get('target') || null;

    if (SC.typeOf(action) == SC.T_FUNCTION) {
      action.call(target) ;
    }
    else if (action) {
      // newer action method + optional target syntax...
      this.getPath('pane.rootResponder').sendAction(action, target, this, this.get('pane'), null, this);

    }
	}

});
