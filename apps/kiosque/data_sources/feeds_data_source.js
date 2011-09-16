// ==========================================================================
// Project:   Kiosque.Feeds
// Copyright: @2011 Strobe, Inc.
// ==========================================================================
/*globals Kiosque jQuery*/

/** @class

  This class implements the main data source of the app. 
  It fetches RSS feeds and parses them into Feed and Article records.
  
  @author Cherif Yaya
  @extends SC.DataSource
*/
Kiosque.FeedsDataSource = SC.DataSource.extend(
/** @scope Kiosque.Feeds.prototype */ {
  
  fetchFeed: function(url, max, successCallback) {
    //We use jQuery because we need JSONP support
    jQuery.ajax({
      url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=%@&q=%@'.fmt(max, encodeURIComponent(url)),
      dataType: 'jsonp',
      context: this,
      success: successCallback
    });
  },

  // ..........................................................
  // QUERY SUPPORT
  // 

  fetch: function(store, query) {
    
    if (query.recordType == Kiosque.Feed) {
      var urls = query.get('feedUrls') ;
      var dataSource = this ;
      var max = query.get('maxEntriesPerFeed') ;
      
      urls.forEach(function(url) {
        //We use jQuery because we need JSONP support
        jQuery.ajax({
          url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=%@&q=%@'.fmt(max, encodeURIComponent(url)),
          dataType: 'jsonp',
          context: dataSource,
          success: function(response) {
            SC.RunLoop.begin(); 
            dataSource.didFetchFeed(response, url, store, query);
            SC.RunLoop.end();
          }
        });
      }) ;
      
      return YES ;
    }
    else if (query.recordType == Kiosque.RssSource) {
      //load feeds lists from cookies
      var feeds = Kiosque.preferencesController.get('feeds') ;
      store.loadRecords(Kiosque.RssSource, feeds) ;
      store.dataSourceDidFetchQuery(query) ;
      query.set('queryLoaded', YES) ;
      
      return YES ;
    }
    
    return NO ; // return YES if you handled the query
  },
  
  didFetchFeed: function(response, feedUrl, store, query) {
    SC.Logger.debug('didFetchFeed %@'.fmt(feedUrl)) ;
    
    //If request OK, load feed and entries
    if (response.responseStatus == 200) {
      var feed = response.responseData.feed ;
      var entries = feed.entries ;
      feed.guid = feed.feedUrl ;
      delete feed.entries ;

      var articlesIds = entries.getEach('link') ;
      feed.articles = articlesIds ;
      entries.forEach(function(x) {
        x.guid = x.link ;
        x.feeds = [feed.guid] ;
        x.source = feedUrl ;
      }) ;
      
      store.loadRecords(Kiosque.Feed, [feed]) ;
      store.loadRecords(Kiosque.Article, entries) ;
    }
    
    if (!SC.none(query)) {
      var fetchedFeeds = query._fetchedFeeds ;
      if (SC.none(fetchedFeeds)) fetchedFeeds = query._fetchedFeeds = [] ;
      fetchedFeeds.push(feedUrl) ;

      if (fetchedFeeds.get('length') == query.getPath('feedUrls.length')) {
        //all feeds have been retrieved. Wrap up
        SC.Logger.debug('All feeds fetched') ;

        store.dataSourceDidFetchQuery(query) ;
        query.set('queryLoaded', YES) ;
      }
    }
  },

  // ..........................................................
  // RECORD SUPPORT
  // 
  
  retrieveRecord: function(store, storeKey) {
    
    // TODO: Add handlers to retrieve an individual record's contents
    // call store.dataSourceDidComplete(storeKey) when done.
    
    return NO ; // return YES if you handled the storeKey
  },
  
  createRecord: function(store, storeKey) {
    //create new source
    if(SC.kindOf(store.recordTypeFor(storeKey), Kiosque.RssSource)) {
      var feed = store.readDataHash(storeKey) ;
      Kiosque.preferencesController.addFeed(feed) ;
      
      store.dataSourceDidComplete(storeKey) ;
      
      this.fetchFeed(feed.url, 45, function(response) {
        SC.RunLoop.begin(); 
        this.didFetchFeed(response, feed.url, store);
        SC.RunLoop.end();
      }) ;
      
      return YES ;
    }
    
    return NO ; // return YES if you handled the storeKey
  },
  
  updateRecord: function(store, storeKey) {
    
    // TODO: Add handlers to submit modified record to the data source
    // call store.dataSourceDidComplete(storeKey) when done.

    return NO ; // return YES if you handled the storeKey
  },
  
  destroyRecord: function(store, storeKey) {
    
    if(SC.kindOf(store.recordTypeFor(storeKey), Kiosque.RssSource)) {
      var feed = store.readDataHash(storeKey) ;
      Kiosque.preferencesController.removeFeed(feed) ;
      
      store.dataSourceDidDestroy(storeKey) ;
      
      return YES ;
    }
    
    return NO ; // return YES if you handled the storeKey
  }
  
}) ;
