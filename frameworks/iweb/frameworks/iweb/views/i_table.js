// ==========================================================================
// Project:   Tab.ITableView
// Copyright: ©2010 Strobe, Inc.
// ==========================================================================
/*globals Tab */

/** @class

  Iphone Like table view that displays a vertical list of items.
	Items can be configured to have a left icon, a right icon,
	an accessory arrow on the right and an optional detail label
	beneath the main label.

  @extends SC.View
*/
Iweb.ITableView = SC.View.extend(
/** @scope IWeb.ITableView.prototype */ {
	rowHeight: 44,
	contentValueKey: null,
	detailValueKey: null,
	hasContentBranch: YES,
	contentIsBranchKey: null,
	hasContentIcon: NO,
	contentIconKey: null,
	hasContentRightIcon: NO,
	contentRightIconKey: null,
	showAlternatingRows: NO,
	content: null,
	selectionBinding: '*.listView.selection',
	action: null,
	target: null,
	spinnerVisible: NO,
	
	spinnerVisibleDidChange: function() {
		var spinnerVisible = this.get('spinnerVisible');
		if (this.spinnerView) this.spinnerView.set('isVisible',spinnerVisible);
	}.observes("spinnerVisible"),

  createChildViews: function() {
		var childViews = [], scrollView, listView, spinnerView;
		
		spinnerView = this.createChildView(
			SC.ImageView.design({
				classNames: 'i-table-view-spinner'.w(),
			  layout: { centerX: 0, width: 32, centerY: 0, height: 32 },
			  value: sc_static('spinner.gif'),
				isVisible: NO
			})
		);
		this.set('spinnerView',spinnerView);
		childViews.push(spinnerView);
		
		var tableView = this;
		
		listView = SC.ListView.create({
			classNames: 'i-table-view'.w(),
		  layout: { top: 0, right: 0, bottom: 0, left: 0 },
			actOnSelect: YES,
			rowHeight: tableView.get('rowHeight'),
			contentValueKey: tableView.get('contentValueKey'),
			detailValueKey: tableView.get('detailValueKey'),
			hasContentBranch: tableView.get('hasContentBranch'),
			contentIsBranchKey: tableView.get('contentIsBranchKey'),
			hasContentIcon: tableView.get('hasContentIcon'),
			contentIconKey: tableView.get('contentIconKey'),
			hasContentRightIcon: tableView.get('hasContentRightIcon'),
			contentRightIconKey: tableView.get('contentRightIconKey'),
			showAlternatingRows: tableView.get('showAlternatingRows'),
			action: tableView.get('action'),
			target: tableView.get('target'),
			exampleView: SC.ListItemView.extend({
				classNames: 'i-list-item-view'.w(),
				
				createRenderer: function(theme) {			
					//override some rendering method
					var meths = {
						//override to render detail label when detailValueKey provided
						render: function(context, firstTime) {
							var indent = this.outlineIndent,
					        level = this.outlineLevel;

					    this.renderControlRenderer(context);

					    //context.setClass(this.calculateClasses());

					    context = context.begin("div").addClass("sc-outline");

					    if (level>=0 && indent>0) {
					      context.addStyle("left", indent * (level+1));
					    }

					    this.renderDisclosure(context);
					    this.renderCheckbox(context);
					    this.renderIcon(context);
					    this.renderLabel(context);
					    this.renderRightIcon(context);
					    this.renderCount(context);
					    this.renderBranch(context);

					    context = context.end(); // end outline

							this.renderDetailLabel(context);				    
						},

						//override to add the has-detail class when we have a detail label
						renderLabel: function(context) {
							var label = this.escapeHTML ? SC.RenderContext.escapeHTML(this.label) : this.label;
					    if(!SC.none(this.detailLabel)) {
								context.push('<label class="has-detail">', label || '', '</label>') ;
							}
							else context.push('<label>', label || '', '</label>') ;
					  },

						//render detail label
						renderDetailLabel: function(context, label) {
							if(!SC.none(this.detailLabel)) {
								context.push('<div><label class="detail">', this.detailLabel || '', '</label></div>') ;
							}
					  }
					};
					
					theme.detailListItem = theme.ListItem.create(meths);
					
			    return theme.detailListItem();
			  },
				
				updateRenderer: function(renderer) {
					sc_super();
					
					var content = this.get('content'),
			        del = this.displayDelegate,
			        key, value;
			
					var attrs = {};
					
					if(this.getDelegateProperty('detailValueKey',del)) {
						key = this.getDelegateProperty('detailValueKey', del) ;
				    value = (key && content) ? (content.get ? content.get(key) : content[key]) : content ;
				    if (value && SC.typeOf(value) !== SC.T_STRING) value = value.toString();
				    attrs.detailLabel = value;
					}
					
					renderer.attr(attrs);					
				}
			}),
			
			selectionDidChange: function() {
				tableView.set('selection',this.get('selection'));
			}.observes('selection'),
			
			OfftouchStart: function(touch, evt) {
		    // When the user presses the mouse down, we don't do much just yet.
		    // Instead, we just need to save a bunch of state about the mouse down
		    // so we can choose the right thing to do later.

		    // Toggle selection only triggers on mouse up.  Do nothing.
		    if (this.get('useToggleSelection')) return true;

		    // find the actual view the mouse was pressed down on.  This will call
		    // hitTest() on item views so they can implement non-square detection
		    // modes. -- once we have an item view, get its content object as well.
		    var itemView      = this.itemViewForEvent(touch),
		        content       = this.get('content'),
		        contentIndex  = itemView ? itemView.get('contentIndex') : -1,
		        info, anchor ;

		    // become first responder if possible.
		    this.becomeFirstResponder() ;
				
				//select right away before raising action on target
				//to avoid incoherence of selection values
				this.select(contentIndex);

		    return YES;
		  }
		});
		this.set('listView', listView);
		
		
		scrollView = this.createChildView(
			SC.ScrollView.design({
				delaysContentTouches: NO,
				alwaysBounceVertical: NO,
				OfftouchWrapUp: function() {
					// we can reset the timeout, as it will no longer be required, and we don't want to re-cancel it later.
			    //this.touch = null;


			    // trigger scroll end
			    this._touchScrollDidChange();

			    // set the scale, vertical, and horizontal offsets to what they technically already are,
			    // but don't know they are yet. This will finally update things like, say, the clipping frame.
			    this.beginPropertyChanges();
			    this.set("scale", this._scale);
			    this.set("verticalScrollOffset", this._scroll_verticalScrollOffset);
			    this.set("horizontalScrollOffset", this._scroll_horizontalScrollOffset);
			    this.endPropertyChanges();

			    return;
				},
				
				OfftouchEnd: function(touch) {
			    var touchStatus = this.touch,
			        avg = touch.averagedTouchesForView(this);

			    touch.scrollHasEnded = YES;
			    if (avg.touchCount > 0) {
			      this.beginTouchTracking(touch, NO);
			    } else {
			      if (this.dragging) {
			        touchStatus.dragging = NO;

			        // reset last event time
			        touchStatus.lastEventTime = touch.timeStamp;

			        this.startDecelerationAnimation();
							//this.touchWrapUp();
			      } else {
			        // this part looks weird, but it is actually quite simple.
			        // First, we send the touch off for capture+starting again, but telling it to return to us
			        // if nothing is found or if it is released.
			        touch.captureTouch(this, YES);

			        // if we went anywhere, did anything, etc., call end()
			        if (touch.touchResponder && touch.touchResponder !== this) {
			          touch.end();
			        }

			        // now check if it was released to us or stayed with us the whole time, or is for some
			        // wacky reason empty (in which case it is ours still). If so, and there is a next responder,
			        // relay to that.
			        if (!touch.touchResponder || touch.touchResponder === this) {
			          if (touch.nextTouchResponder) touch.makeTouchResponder(touch.nextTouchResponder);
			        } else {
			          // in this case, the view that captured it and changed responder should have handled
			          // everything for us.
			        }
			      }

			      this.tracking = NO;
			      this.dragging = NO;
			    }
			  },
			
				OffdecelerateAnimation: function() {
			    // get a bunch of properties. They are named well, so not much explanation of what they are...
			    // However, note maxOffsetX/Y takes into account the scale;
			    // also, newX/Y adds in the current deceleration velocity (the deceleration velocity will
			    // be changed later in this function).
			    var touch = this.touch,
			        scale = this._scale,
			        minOffsetX = this.minimumScrollOffset(touch.contentSize.width * this._scale, touch.containerSize.width, this.get("horizontalAlign")),
			        minOffsetY = this.minimumScrollOffset(touch.contentSize.height * this._scale, touch.containerSize.height, this.get("verticalAlign")),
			        maxOffsetX = this.maximumScrollOffset(touch.contentSize.width * this._scale, touch.containerSize.width, this.get("horizontalAlign")),
			        maxOffsetY = this.maximumScrollOffset(touch.contentSize.height * this._scale, touch.containerSize.height, this.get("verticalAlign")),

			        now = Date.now(),
			        t = Math.max(now - touch.lastEventTime, 1),

			        newX = this._scroll_horizontalScrollOffset + touch.decelerationVelocity.x * (t/10),
			        newY = this._scroll_verticalScrollOffset + touch.decelerationVelocity.y * (t/10);

			    var de = touch.decelerationFromEdge, ac = touch.accelerationToEdge;

			    // under a few circumstances, we may want to force a valid X/Y position.
			    // For instance, if bouncing is disabled, or if position was okay before
			    // adjusting scale.
			    var forceValidXPosition = !touch.enableBouncing, forceValidYPosition = !touch.enableBouncing;

			    // determine if position was okay before adjusting scale (which we do, in
			    // a lovely, animated way, for the scaled out/in too far bounce-back).
			    // if the position was okay, then we are going to make sure that we keep the
			    // position okay when adjusting the scale.
			    //
			    // Position OKness, here, referring to if the position is valid (within
			    // minimum and maximum scroll offsets)
			    if (newX >= minOffsetX && newX <= maxOffsetX) forceValidXPosition = YES;
			    if (newY >= minOffsetY && newY <= maxOffsetY) forceValidYPosition = YES;

			    // We are going to change scale in a moment, but the position should stay the
			    // same, if possible (unless it would be more jarring, as described above, in
			    // the case of starting with a valid position and ending with an invalid one).
			    //
			    // Because we are changing the scale, we need to make the position scale-neutral.
			    // we'll make it non-scale-neutral after applying scale.
			    //
			    // Question: might it be better to save the center position instead, so scaling
			    // bounces back around the center of the screen?
			    newX /= this._scale;
			    newY /= this._scale;

			    // scale velocity (amount to change) starts out at 0 each time, because 
			    // it is calculated by how far out of bounds it is, rather than by the
			    // previous such velocity.
			    var sv = 0;

			    // do said calculation; we'll use the same bouncyBounce method used for everything
			    // else, but our adjustor that gives a minimum amount to change by and (which, as we'll
			    // discuss, is to make the stop feel slightly more like a stop), we'll leave at 0 
			    // (scale doesn't really need it as much; if you disagree, at least come up with 
			    // numbers more appropriate for scale than the ones for X/Y)
			    sv = this.bouncyBounce(sv, scale, touch.minimumScale, touch.maximumScale, de, ac, 0);

			    // add the amount to scale. This is linear, rather than multiplicative. If you think
			    // it should be multiplicative (or however you say that), come up with a new formula.
			    this._scale = scale = scale + sv;

			    // now we can convert newX/Y back to scale-specific coordinates...
			    newX *= this._scale;
			    newY *= this._scale;

			    // It looks very weird if the content started in-bounds, but the scale animation
			    // made it not be in bounds; it causes the position to animate snapping back, and,
			    // well, it looks very weird. It is more proper to just make sure it stays in a valid
			    // position. So, we'll determine the new maximum/minimum offsets, and then, if it was
			    // originally a valid position, we'll adjust the new position to a valid position as well.


			    // determine new max offset
			    minOffsetX = this.minimumScrollOffset(touch.contentSize.width * this._scale, touch.containerSize.width, this.get("horizontalAlign"));
			    minOffsetY = this.minimumScrollOffset(touch.contentSize.height * this._scale, touch.containerSize.height, this.get("verticalAlign"));
			    maxOffsetX = this.maximumScrollOffset(touch.contentSize.width * this._scale, touch.containerSize.width, this.get("horizontalAlign"));
			    maxOffsetY = this.maximumScrollOffset(touch.contentSize.height * this._scale, touch.containerSize.height, this.get("verticalAlign"));

			    // see if scaling messed up the X position (but ignore if 'tweren't right to begin with).
			    if (forceValidXPosition && (newX < minOffsetX || newX > maxOffsetX)) {
			      // Correct the position
			      newX = Math.max(minOffsetX, Math.min(newX, maxOffsetX));

			      // also, make the velocity be ZERO; it is obviously not needed...
			      touch.decelerationVelocity.x = 0;
			    }

			    // now the y
			    if (forceValidYPosition && (newY < minOffsetY || newY > maxOffsetY)) {
			      // again, correct it...
			      newY = Math.max(minOffsetY, Math.min(newY, maxOffsetY));

			      // also, make the velocity be ZERO; it is obviously not needed...
			      touch.decelerationVelocity.y = 0;
			    }


			    // now that we are done modifying the position, we may update the actual scroll
			    this._scroll_horizontalScrollOffset = newX;
			    this._scroll_verticalScrollOffset = newY;

			    this._applyCSSTransforms(touch.layer); // <- Does what it sounds like.

			    SC.RunLoop.begin();
			    //this._touchScrollDidChange();
					this.touchWrapUp();
			    SC.RunLoop.end();

			    // Now we have to adjust the velocities. The velocities are simple x and y numbers that
			    // get added to the scroll X/Y positions each frame.
			    // The default decay rate is .950 per frame. To achieve some semblance of accuracy, we
			    // make it to the power of the elapsed number of frames. This is not fully accurate,
			    // as this is applying the elapsed time between this frame and the previous time to
			    // modify the velocity for the next frame. My mind goes blank when I try to figure out
			    // a way to fix this (given that we don't want to change the velocity on the first frame),
			    // and as it seems to work great as-is, I'm just leaving it.
			    var decay = touch.decelerationRate;
			    touch.decelerationVelocity.y *= Math.pow(decay, (t / 10));
			    touch.decelerationVelocity.x *= Math.pow(decay, (t / 10));

			    // We have a bouncyBounce method that adjusts the velocity for bounce. That is, if it is
			    // out of range and still going, it will slow it down. This step is decelerationFromEdge.
			    // If it is not moving (or has come to a stop from decelerating), but is still out of range, 
			    // it will start it moving back into range (accelerationToEdge)
			    // we supply de and ac as these properties.
			    // The .3 artificially increases the acceleration by .3; this is actually to make the final
			    // stop a bit more abrupt.
			    touch.decelerationVelocity.x = this.bouncyBounce(touch.decelerationVelocity.x, newX, minOffsetX, maxOffsetX, de, ac, 0.3);
			    touch.decelerationVelocity.y = this.bouncyBounce(touch.decelerationVelocity.y, newY, minOffsetY, maxOffsetY, de, ac, 0.3);

			    // if we ain't got no velocity... then we must be finished, as there is no where else to go.
			    // to determine our velocity, we take the absolue value, and use that; if it is less than .01, we
			    // must be done. Note that we check scale's most recent velocity, calculated above using bouncyBounce,
			    // as well.
			    var absXVelocity = Math.abs(touch.decelerationVelocity.x);
			    var absYVelocity = Math.abs(touch.decelerationVelocity.y);
			    if (absYVelocity < 0.01 && absXVelocity < 0.01 && Math.abs(sv) < 0.01) {
			      // we can reset the timeout, as it will no longer be required, and we don't want to re-cancel it later.
			      touch.timeout = null;
			      this.touch = null;

			      // we aren't in a run loop right now (see below, where we trigger the timer)
			      // so, we must start one.
			      SC.RunLoop.begin();

			      // trigger scroll end
			      this._touchScrollDidEnd();

			      // set the scale, vertical, and horizontal offsets to what they technically already are,
			      // but don't know they are yet. This will finally update things like, say, the clipping frame.
			      this.beginPropertyChanges();
			      this.set("scale", this._scale);
			      this.set("verticalScrollOffset", this._scroll_verticalScrollOffset);
			      this.set("horizontalScrollOffset", this._scroll_horizontalScrollOffset);
			      this.endPropertyChanges();

			      // and now we're done, so just end the run loop and return.
			      SC.RunLoop.end();
			      return;
			    }

			    // We now set up the next round. We are doing this as raw as we possibly can, not touching the
			    // run loop at all. This speeds up performance drastically--keep in mind, we're on comparatively
			    // slow devices, here. So, we'll just make a closure, saving "this" into "self" and calling
			    // 10ms later (or however long it takes). Note also that we save both the last event time
			    // (so we may calculate elapsed time) and the timeout we are creating, so we may cancel it in future.
			    var self = this;
			    touch.lastEventTime = Date.now();
			    this.touch.timeout = setTimeout(function(){
			      SC.RunLoop.begin();
			      self.decelerateAnimation();
			      SC.RunLoop.end();
			    }, 10);
			  },
			})
		);
		childViews.push(scrollView);
		scrollView.set('contentView', listView) ;
		
		this.set('childViews', childViews);
	},
	
	contentDidChange: function() {
		this.get('listView').set('content', this.get('content'));
	}.observes('content')

});
