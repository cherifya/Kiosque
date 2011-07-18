// ==========================================================================
// Project:   IWeb.CarrouselView
// Copyright: ©2010 Strobe, Inc.
// ==========================================================================
/*globals Iweb */

/** @class

  Container view for laying out items horizontally.

  @author Cherif Yaya
  @extends SC.View
*/
Iweb.CarrouselView = SC.View.extend(
/** @scope Iweb.CarrouselView.prototype */ {
  classNames: 'sc-carrousel-view'.w(),
  
  /**
    
    
    @type String
    @default null
  */
  contentValueKey: null,
  
  /**
    
    
    @type String
    @default null
  */
  contentIconKey: null,
  
  /**
    Array containing the items to be displayed
    
    @type Array
    @default null
  */
  content: null,
  
  /**
    Current selection object.
    
    @type SC.Object
    @default null
  */
  selection: null,
  
  /**
    Width of each column
    
    @type Number
    @default 48
  */
  columnWidth: 48,
  
  /**
    Height of the items
    
    @type Number
    @default 48
  */
  rowHeight: 48,
  
  /**
    Action called when an item is clicked
    
    @type String
    @default null
  */
  action: null,
  
  /**
    Default view loaded by default. This is the root view of the hierarchy
    
    @type Object
    @default null
  */
  target: null,
  
  /**
    Default view loaded by default. This is the root view of the hierarchy
    
    @type SC.View
    @default null
  */
  exampleView: SC.LabelView,

	
	/** @private */
	init: function() {
		sc_super();
		
		var gridView = this.getPath('scrollView.contentView');
		
		if (gridView) {
		  //set carrousel view to trigger all bound properties update
		  gridView.set('carrouselView',this);
		  /*
		  gridView.set('columnWidth',this.get('columnWidth'));
		  gridView.set('rowHeight',this.get('rowHeight'));
		  gridView.set('contentValueKey',this.get('contentValueKey'));
		  gridView.set('contentIconKey',this.get('contentIconKey'));
		  gridView.set('action',this.get('action'));
		  gridView.set('target',this.get('target'));
		  gridView.set('exampleView',this.exampleView);
		  */
		}
	}, 
	
	/** @private */
	childViews: 'scrollView'.w(),
	
	/** @private */
	gridView: function() {
	  return this.getPath('scrollView.contentView');
	}.property(),
	
	/** @private */
	scrollView: SC.ScrollView.design({
	  layout: {left:0, right:0, top:0, bottom:0},
	  canScrollVertical: NO,
	  hasVerticalScroller: NO,
	  alwaysBounceHorizontal: YES,
    alwaysBounceVertical: NO,
	  
	  contentView: SC.GridView.design({
	    classNames: 'sc-carrousel-grid-view'.w(),
	    carrouselView: null,
	    layout: {top:0, left:0, right:0, bottom:0},
	    contentValueKeyBinding: '*carrouselView.contentValueKey',
      contentIconKey: '*carrouselView.contentIconKey',
      contentBinding: '*carrouselView.content',
      selectionBinding: '*carrouselView.selection',
      actionBinding: '*carrouselView.action',
      targetBinding: '*carrouselView.target',
      columnWidthBinding: '*carrouselView.columnWidth',
      rowHeightBinding: '*carrouselView.rowHeight',
      exampleViewBinding: '*carrouselView.exampleView',
      canEditContent: NO,
      canDeleteContent: NO,

      /** @private 
        Overrides default CollectionView method to compute the layout of each item
      */
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
        Overrides default CollectionView method to compute the minimim height and width
        of the list view.
      */
      computeLayout: function() {
        var content = this.get('content'),
            count = (content) ? content.get('length') : 0,
            rowHeight = this.get('rowHeight') || 48,
            columnWidth = this.get('columnWidth') || 48,
            itemsPerRow = (count) ? count : 0,
            rows = Math.ceil(count / itemsPerRow) ;

        // use this cached layout hash to avoid allocatining memory...
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
});
