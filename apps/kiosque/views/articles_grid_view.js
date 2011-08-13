// ==========================================================================
// Project:   Kiosque.ArticlesGridView
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque Iweb */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Kiosque.ArticlesGridView = Iweb.TabControlView.extend(
/** @scope Kiosque.ArticlesGridView.prototype */ {

  content: null,
  contentValueKey: null,
  contentIconKey: null,
  selection: null,
  action: null,
  target: null,
  
  /** @private */
  init: function() {
    sc_super() ;
  },
  
  /** @private */
  _pagesPool: [],
  
  /** @private */
  _pages: [],
  
  /** @private 
      Computes current orientation based on width. 
  */
  orientation: function() {
    var f = this.get("frame");
    if (f.width > f.height) return SC.HORIZONTAL_ORIENTATION;
    else return SC.VERTICAL_ORIENTATION;
  }.property("frame").cacheable(),
  
  /** @private */
  columnWidth: function() {
    var frame = this.get('frame'),
        orientation = this.get('orientation') ;
    
    
  }.property('orientation').cacheable(),
  
  /** @private */
  rowHeight: function() {
    
  }.property('orientation').cacheable(),
  
  /** @private */
  _contentDidChange: function() {
    
  }.observes('content'),
  
  /**
    The number of items per page
    
    @field
    @type Number
    @default 10 or 9 depending on the orientation
  */
  itemsPerPage: function() {
    var orientation = this.get('orientation') ;
    
    if (orientation == SC.HORIZONTAL_ORIENTATION) return 10 ;
    else return 9 ;
  }.property('orientation'),
  
  computePages: function() {
    var itemsPerPage = this.get('itemsPerPage'),
        totalItems = this.getPath('content.length'),
        nbPagesNeeded = Math.max(Math.ceil(totalItems*1.0/itemsPerPage), 1),
        nbPagesCreated = this._pages.get('length') ;
        
    if (nbPagesNeeded > nbPagesCreated) {
      for (var i = nbPagesCreated; i < nbPagesNeeded; i++) {
        //create page
        var page = this._pagesPool.pop();
        if (SC.none(page)) {
          page = Kiosque.ArticlesPageView.create({
            articlesGrid: this
          });
        }      
        
        this._pages.push(page) ;
      }
    }
    else if (nbPagesNeeded < nbPagesCreated) {
      
    }
        
    
  }.observes('*content.length', 'itemsPerPage')

});
