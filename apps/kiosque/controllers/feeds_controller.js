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
  feedUrls: 'http://www.tuaw.com/rss.xml http://daringfireball.net/index.xml'.w(),
  maxEntriesPerFeed: 45,
  
  loadFeeds: function() {
    this.set('loadingData', YES) ;
    var controller = this,
        feeds = this.get('content') ;
        
    if (SC.none(feeds)) {
      var query = SC.Query.local(Kiosque.Feed, {
        feedUrls: this.get('feedUrls'),
        maxEntriesPerFeed: this.get('maxEntriesPerFeed'),
        queryLoaded: NO,
        queryLoadedDidChange: function() {
          var queryLoaded = this.get('queryLoaded') ;
          if (queryLoaded) controller.set('loadingData', NO) ;
        }.observes('queryLoaded')
      }) ;
      feeds = Kiosque.store.find(query) ;
      this.set('content', feeds) ;
    }
    else feeds.refresh() ;
  }

}) ;
