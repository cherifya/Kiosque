// ==========================================================================
// Project:   Kiosque.ArticlesPageView
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque */
require('views/article_thumbnail_view');
/** @class

  (Document Your View Here)

  @extends SC.View
*/
Kiosque.ArticlesPageView = SC.GridView.extend(
/** @scope Kiosque.ArticlesPageView.prototype */ {

  classNames: 'articles-grid-page'.w(),
  articlesGrid: null,
  layout: {top:0, left:0, right:0, bottom:0},
  content: null,
  contentValueKeyBinding: '*articlesGrid.contentValueKey',
  contentIconKey: '*articlesGrid.contentIconKey',
  selectionBinding: '*articlesGrid.selection',
  actionBinding: '*articlesGrid.action',
  targetBinding: '*articlesGrid.target',
  columnWidthBinding: '*articlesGrid.columnWidth',
  rowHeightBinding: '*articlesGrid.rowHeight',
  itemsSpacingBinding: '*articlesGrid.itemsSpacing',
  orientationBinding: '*articlesGrid.orientation',
  exampleView: Kiosque.ArticleThumbnailView.design(),
  canEditContent: NO,
  canDeleteContent: NO,
  
  /** @private */
  itemsPerRow: function() {
    var orientation = this.get('orientation') ;

    if (orientation == SC.HORIZONTAL_ORIENTATION) return 5 ;
    else return 3 ;
  }.property('orientation').cacheable(),
  
  /** @private 
    Overriden to set a constant width for the items
    In the base class, the columnWidth depends on the clippingFrame
  */
  layoutForContentIndex: function(contentIndex) {
    var rowHeight = this.get('rowHeight') || 48,
        frameWidth = this.get('clippingFrame').width,
        itemsPerRow = this.get('itemsPerRow'),
        columnWidth = this.get('columnWidth') || 48, 
        spacing = this.get('itemsSpacing') || 10,
        row = Math.floor(contentIndex / itemsPerRow),
        col = contentIndex - (itemsPerRow*row) ;
    return { 
      left: col * (columnWidth + spacing),
      top: row * (rowHeight + spacing),
      height: rowHeight,
      width: columnWidth
    };
  },
  
  /** @private
    Overriden to prevent unnecessary item view layout updates
  */
  _gv_clippingFrameDidChange: function() {
    
  }.observes('clippingFrame'),
  
  /** @private
    Overrides default CollectionView method to compute the minimim height and width
    of the list view.
  */
  computeLayout: function() {
    var content = this.get('content'),
        count = (content) ? content.get('length') : 0,
        rowHeight = this.get('rowHeight') || 48,
        columnWidth = this.get('columnWidth') || 48,
        itemsPerRow = this.get('itemsPerRow'),
        rows = Math.ceil(count / itemsPerRow) ;

    // use this cached layout hash to avoid allocatining memory...
    var ret = this._cachedLayoutHash ;
    if (!ret) ret = this._cachedLayoutHash = {};

    // set minHeight
    ret.minHeight = rows * rowHeight ;
    this.calculatedHeight = ret.minHeight;
    
    //set minWidth
    ret.minWidth = itemsPerRow * columnWidth;
    this.calculatedWidth = ret.minWidth;
    return ret; 
  },
  
  toString: function() {
    return 'page %@'.fmt(this.get('content')) ;
  }

});
