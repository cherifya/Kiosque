// ==========================================================================
// Project:   Kiosque.ArticlesGridView
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque Iweb */
require('system/array_page');
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
        nbPagesCreated = this._pages.get('length'),
        content = this.get('content') ;
    
    var page, i;
       
    if (nbPagesNeeded > nbPagesCreated) {
      //add missing pages
      for (i = nbPagesCreated; i < nbPagesNeeded; i++) {
        //create page
        page = this._pagesPool.pop();
        if (SC.none(page)) {
          page = Kiosque.ArticlesPageView.create();
        }  
        
        //update page
        page.set('pageIndex', i) ;
        page.set('articlesGrid', this) ;
        page.set('content', Kiosque.ArrayPage.create({
          masterArray: content,
          itemsPerPage: itemsPerPage,
          pageIndex: i
        })) ;
        
        this._pages.push(page) ;
        //add tab
        this.addTab(page) ;
      }
    }
    else if (nbPagesNeeded < nbPagesCreated) {
      //removed 
      for (i = nbPagesNeeded; i< nbPagesCreated; i++) {
        page = this._pages.pop();
        this.removeTab(page.get('pageIndex')) ;
        
        page.set('content', null) ;
        page.set('pageIndex', null) ;
        page.set('articlesGrid', null) ;
        
        //return page to pool to be reused later if needed
        this._pagesPool.push(page) ;
      }
    }
    
    //TODO update all pages with pageIndex
        
    
  }.observes('*content.length', 'itemsPerPage')

});
