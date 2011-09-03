// ==========================================================================
// Project:   Kiosque.feedsController
// Copyright: @2011 Strobe, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  Controller class for feeds records.

  @author Cherif Yaya
  @extends SC.Object
*/
Kiosque.feedsController = SC.ArrayController.create(
/** @scope Kiosque.feedsController.prototype */ {
  
  loadingData: NO,
  url: 'http://www.tuaw.com/rss.xml',
  
  loadFeeds: function() {
    this.set('loadingData', YES) ;
    var controller = this,
        feeds = this.get('content') ;
        
    if (SC.none(feeds)) {
      var query = SC.Query.local(Kiosque.Feed, {
        feedUrl: this.get('url')
      }) ;
      feeds = Kiosque.store.find(query) ;
      this.set('content', feeds) ;
    }
    else feeds.refresh() ;
  }

}) ;
