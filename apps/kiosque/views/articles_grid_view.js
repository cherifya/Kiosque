// ==========================================================================
// Project:   Kiosque.ArticlesGridView
// Copyright: @2011 Strobe, Inc.
// ==========================================================================
/*globals Kiosque Iweb */
require('system/array_page');
require('views/articles_page_view');

/** @class

  This class implements a layout of items (articles) in a grid-like fashion.
  It supports paging the items. When in landscape have 5 by 2 grid of items
  In Portrait use a 3 by 3 grid.
  
  The user can navigate through the pages by flicking left and right.

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
  
  classNames: 'articles-grid'.w(),
  
  /** @private */
  _pagesPool: [],
  
  /** @private */
  _pages: [],
  
  /** @private spacing between items in the grid 10px*/
  itemsSpacing: 10,
  
  /** @private */
  pageExampleView: Kiosque.ArticlesPageView,
  
  /** @private */
  isTabBarVisible: NO,
  
  /** @private */
  flickingThreshold: 0.3,
  
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
        itemsSpacing = this.get('itemsSpacing'),
        orientation = this.get('orientation') ;
        
    //When in landscape have 5 by 2 grid of items
    //In Portrait use a 3 by 3 grid
    var itemsPerRow = orientation === SC.HORIZONTAL_ORIENTATION ? 5 : 3 ;
    var colWidth = (frame.width - (itemsSpacing * (itemsPerRow-1))) / itemsPerRow ;
    
    return colWidth ;
  }.property('orientation').cacheable(),
  
  /** @private */
  rowHeight: function() {
    var frame = this.get('frame'),
        itemsSpacing = this.get('itemsSpacing'),
        orientation = this.get('orientation') ;
    //When in landscape have 5 by 2 grid of items
    //In Portrait use a 3 by 3 grid
    var itemsPerCol = orientation === SC.HORIZONTAL_ORIENTATION ? 2 : 3 ;
    var rowHeight = (frame.height - (itemsSpacing * (itemsPerCol-1))) / itemsPerCol ;
    
    return rowHeight ;
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
  
  /** @private 
    Create and update pages (tabs) as the content or the orientation change
  */
  _computePages: function() {
    var itemsPerPage = this.get('itemsPerPage'),
        totalItems = this.getPath('content.length'),
        nbPagesNeeded = Math.max(Math.ceil(totalItems*1.0/itemsPerPage), 1),
        nbPagesCreated = this._pages.get('length'),
        content = this.get('content'),
        pageExampleView = this.get('pageExampleView') ;
    
    var page, i;
    
    //Create and remove pages as needed
    if (nbPagesNeeded > nbPagesCreated) {
      //add missing pages
      for (i = nbPagesCreated; i < nbPagesNeeded; i++) {
        //create page
        page = this._pagesPool.pop();
        if (SC.none(page)) {
          //create a new page 
          //note that we do not actually instantiate the view here
          //the addTab() method will do that
          page = pageExampleView.design({
            pageIndex: i,
            articlesGrid: this,
            content: Kiosque.ArrayPage.create({
              masterArray: content,
              itemsPerPage: itemsPerPage,
              pageIndex: i
            })
          });
        }
        else {
          //page view already instantiated.
          //just update page with new info
          page.set('pageIndex', i) ;
          page.set('articlesGrid', this) ;
          page.set('content', Kiosque.ArrayPage.create({
            masterArray: content,
            itemsPerPage: itemsPerPage,
            pageIndex: i
          })) ;
        }
        
        //add tab
        //this is where the view is instantiated in case it were just created
        page = this.addTab(page) ;
        
        this._pages.push(page) ;
      }
    }
    else if (nbPagesNeeded < nbPagesCreated) {
      //too many pages created. we don't need them all
      //remove the extra
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
    
    //update all pages with new pageIndex and itemsPerPage
    this._updatePagesContent() ;
  }.observes('*content.length', 'itemsPerPage'),
  
  /** @private 
    Update array pages content as needed
  */
  _updatePagesContent: function() {
    var itemsPerPage = this.get('itemsPerPage'),
        totalItems = this.getPath('content.length'),
        nbPagesCreated = this._pages.get('length'),
        content = this.get('content') ;
    var i, page, arrayPage;
    
    for (i = 0; i < nbPagesCreated; i++) {
      page = this._pages[i];
      arrayPage = page.get('content') ;
      if (SC.none(arrayPage)) {
        //create array page
        arrayPage = Kiosque.ArrayPage.create({
          masterArray: content,
          itemsPerPage: itemsPerPage,
          pageIndex: i
        }) ;
        page.set('content',arrayPage) ;
      }
      //update array page
      arrayPage.setIfChanged('masterArray', content) ;
      arrayPage.setIfChanged('pageIndex', i) ;
      arrayPage.setIfChanged('itemsPerPage', itemsPerPage) ; 
    }
  }
});
