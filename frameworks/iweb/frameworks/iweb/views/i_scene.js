// ==========================================================================
// Project:   Iweb.ISceneView
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Oritide */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Iweb.ISceneView = SC.SceneView.extend(
/** @scope Oritide.OritideSceneView.prototype */ {

  /** @private
  
    Invoked whenever we need to animate in the new scene.
  */
  animateScene: function(newContent) {
    var oldContent = this._targetView,
        outIdx     = this._targetIndex,
        scenes     = this.get('scenes'),
        inIdx      = scenes ? scenes.indexOf(this.get('nowShowing')) : -1,
        layout;

    if (outIdx<0 || inIdx<0 || outIdx===inIdx) {
      return this.replaceScene(newContent);
    }

    this._targetView = newContent ;
    this._targetIndex = inIdx; 
    
    // save some info needed for animation
    if (inIdx > outIdx) {
      this._leftView  = oldContent;
      this._rightView = newContent;
      this._target    = SC.TO_LEFT;
    } else {
      this._leftView  = newContent ;
      this._rightView = oldContent ;
      this._target    = SC.TO_RIGHT;
    }

    // setup views
    this.removeAllChildren();

    if (oldContent) this.appendChild(oldContent)
    if (newContent) this.appendChild(newContent);
		
		var transitionDuration = this.get('transitionDuration');

    // setup other general state
    this._start   = Date.now();
    this._end     = this._start + transitionDuration;
		if (this._start == this._end) return this.replaceScene(this._targetView);
		
    this._state   = this.ANIMATING;
    
		//layout = SC.clone(this.get('frame'));
		transitionDuration = transitionDuration * 1.0 / 1000;
		
		var navigationTransitions = {
			left: { duration: transitionDuration, timing: SC.Animatable.TRANSITION_EASE_IN_OUT, action: "animationDidFinish" },
			transform: { duration: transitionDuration, timing: SC.Animatable.TRANSITION_EASE_IN_OUT, action: 'animationDidFinish' }
    };
		
		var sceneView = this;
		
		//mixin SC.Animatable if needed
		if (!this._leftView.isAnimatable) {
			this._leftView.mixin(SC.Animatable);			
		}
		//to be notified
		if (!this._leftView.animationDidFinish) {
			SC.mixin(this._leftView,{
				animationDidFinish: function() {
					sceneView.animationDidFinish("left");
				}
			});
			SC.mixin(this._leftView.transitions, navigationTransitions);
		};
		
		
		if (!this._rightView.isAnimatable) {
			this._rightView.mixin(SC.Animatable);			
		}
		//to be notified at the end
		if (!this._rightView.animationDidFinish) {
			SC.mixin(this._rightView,{
				animationDidFinish: function() {
					sceneView.animationDidFinish("right");
				}
			});
			SC.mixin(this._rightView.transitions, navigationTransitions);
		};
		
		//animate
		var metrics = this._leftView.computeFrameWithParentFrame();
    this._leftView.disableAnimation();
		this._rightView.disableAnimation();
		
		if (this._target === SC.TO_LEFT) {
			
			this._leftView.set('layout',{left: 0, width: metrics.width, top: 0, bottom: 0});
			this._rightView.set('layout',{left: metrics.width, width: metrics.width, top: 0, bottom: 0});
		}
		else {
			this._leftView.set('layout',{left: -metrics.width, width: metrics.width, top: 0, bottom: 0});
			this._rightView.set('layout',{left: 0, width: metrics.width, top: 0, bottom: 0});
		}
		
    this._leftView.enableAnimation();
		this._rightView.enableAnimation();
		
		
		if (this._target === SC.TO_LEFT) {
			this.invokeLater("transform", 10, -metrics.width);
		}
		else {
			this.invokeLater("transform", 10, metrics.width);
		}
		
  },

	/**
    @private
    Applies the supplied CSS transform.
  */
  transform: function(translation) {
		var pos = translation;
		SC.Logger.info("transforming..."+pos);
		/*
		var f1 = this._leftView.computeFrameWithParentFrame();
		var f2 = this._rightView.computeFrameWithParentFrame();
		
   	var leftL = this._leftView.computeFrameWithParentFrame().x, rightL = this._rightView.computeFrameWithParentFrame().x;
		var width = this._leftView.computeFrameWithParentFrame().width;
		
    this._leftView.set('layout', {left: (leftL+translation), width: width, top: 0, bottom: 0});
		this._rightView.set('layout', {left: (rightL+translation), width: width, top: 0, bottom: 0});
		*/
		
		if (SC.Animatable.enableCSS3DTransforms) {
      this._leftView.adjust("transform", "translate3d(" + pos + "px,0px,0px)");
			this._rightView.adjust("transform", "translate3d(" + pos + "px,0px,0px)");
    } else {
      this._leftView.adjust("transform", "translate(" + pos + "px,0px)");
			this._rightView.adjust("transform", "translate(" + pos + "px,0px)");
    }
    
  },

	animationDidFinish: function(msg) {
		SC.Logger.info("animationDidFinish..."+msg);
		this._leftView.disableAnimation();
		this._rightView.disableAnimation();
		this.transform(0);
		
		return this.replaceScene(this._targetView);
	}

});
