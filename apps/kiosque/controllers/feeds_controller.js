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
  feedUrls: 'http://feeds.arstechnica.com/arstechnica/index'.w(),
  //feedUrls: 'http://daringfireball.net/index.xml'.w(),
  sourcesBinding: 'Kiosque.sourcesController.content',
  maxEntriesPerFeed: 45,
  selection: null,
  
  /**
	 Loads all registered feeds from the store.
	*/
  loadFeeds: function() {
    this.set('loadingData', YES) ;
    var controller = this,
        feeds = this.get('content') ;
        
    var sources = this.get('sources') ;
    if (SC.none(sources)) return ;
        
    if (SC.none(feeds)) {
      var query = SC.Query.local(Kiosque.Feed, {
        feedUrls: sources.getEach('url'),
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
  },
  
  /**
	 Displays a spinning wheel while loading feeds and articles data.
	*/
  loadingDataDidChange: function() {
    var loadingData = this.get('loadingData') ;
    if (!loadingData) {
      this.invokeLater('hideSpinner', 3000) ;
    }
    else {
      Kiosque.statechart.sendEvent('showSpinner') ;
    }
  }.observes('loadingData'),
  
  /**
	 Called when data loading is over to hide spinner.
	*/
  hideSpinner: function() {
    Kiosque.statechart.sendEvent('hideSpinner') ;
  }

}) ;
