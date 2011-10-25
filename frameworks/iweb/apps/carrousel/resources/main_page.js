// ==========================================================================
// Project:   Carrousel - mainPage
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Carrousel Iweb*/

// This page describes the main user interface for your application.  
Carrousel.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    childViews: 'carrousel'.w(),
    
    labelView: SC.LabelView.design({
      layout: { centerX: 0, centerY: 0, width: 200, height: 18 },
      textAlign: SC.ALIGN_CENTER,
      tagName: "h1", 
      value: "Welcome to SproutCore!"
    }),
    
    carrousel: Iweb.CarrouselView.design({
      layout: {centerY:0, centerX:0, width:300, height:60},
      contentValueKey: 'order',
      contentBinding: 'Carrousel.thumbsController.arrangedObjects',
      selectionBinding: 'Carrousel.thumbsController.selection',
      columnWidth: 60,
      rowHeight: 60,
      exampleView: SC.LabelView.design({
        classNames: 'fantasy-label'.w()
      })
    }),
    
    scrollView: SC.ScrollView.design({
      backgroundColor: 'white',
  	  layout: {centerY:0, centerX:0, width:300, height:60},
  	  canScrollVertical: NO,
  	  hasVerticalScroller: NO,
  	  alwaysBounceHorizontal: YES,
      alwaysBounceVertical: NO,
      
      _applyCSSTransforms: function(layer) {
        var transform = "";
        this.updateScale(this._scale);
        transform += 'translate3d('+ -this._scroll_horizontalScrollOffset +'px, '+ -Math.round(this._scroll_verticalScrollOffset)+'px,0) ';
        transform += this._scale_css;
        if (layer) {
          SC.Logger.debug('webkitTransform %@... %@'.fmt(transform,this));
          //layer.style.webkitTransform = transform;
          layer.style.webkitTransformOrigin = "top left";
        }
      },
  	  
  	  
  	  contentView: SC.GridView.design({
  	    backgroundColor: 'gray',
  	    layout: {top:0, left:0, width:300, height:60},
        contentValueKey: 'order',
        contentBinding: 'Carrousel.thumbsController.arrangedObjects',
        selectionBinding: 'Carrousel.thumbsController.selection',
        columnWidth: 60,
        rowHeight: 60,

        /** @private */
        layoutForContentIndex: function(contentIndex) {
          var rowHeight = this.get('rowHeight') || 48,
              columnWidth = this.get('columnWidth') || 48;
          return { 
            left: contentIndex * columnWidth,
            top: 0,
            height: rowHeight,
            width: columnWidth
          };
        },
        
        /** @private
          Overrides default CollectionView method to compute the minimim height
          of the list view.
        */
        computeLayout: function() {
          var content = this.get('content'),
              count = (content) ? content.get('length') : 0,
              rowHeight = this.get('rowHeight') || 48,
              columnWidth = this.get('columnWidth') || 48,
              itemsPerRow = (count) ? count : 0,
              rows = Math.ceil(count / itemsPerRow) ;

          // use this cached layout hash to avoid allocing memory...
          var ret = this._cachedLayoutHash ;
          if (!ret) ret = this._cachedLayoutHash = {};

          // set minHeight
          ret.minHeight = rows * rowHeight ;
          this.calculatedHeight = ret.minHeight;
          
          //set minWidth
          ret.minWidth = count * columnWidth;
          this.calculatedWidth = ret.minWidth;
          return ret; 
        }
      })
  	})
  })

});
