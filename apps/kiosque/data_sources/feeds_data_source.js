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
      }) ;
      
      store.loadRecords(Kiosque.Feed, [feed]) ;
      store.loadRecords(Kiosque.Article, entries) ;
      
      /*
      //now store this feed and its entries in the global arrays.
      //these global arrays are loaded in the store once all requests have returned
      var allFeeds = query._allFeeds ;
      if (SC.none(allFeeds)) allFeeds = query._allFeeds = [] ;
      allFeeds.push(feed) ;
      
      var allArticles = query._allArticles ;
      if (SC.none(allArticles)) allArticles = query._allArticles = [] ;
      allArticles.pushObjects(entries) ;
      
      */
    }
    
    var fetchedFeeds = query._fetchedFeeds ;
    if (SC.none(fetchedFeeds)) fetchedFeeds = query._fetchedFeeds = [] ;
    fetchedFeeds.push(feedUrl) ;
    
    if (fetchedFeeds.get('length') == query.getPath('feedUrls.length')) {
      //all feeds have been retrieved. Wrap up
      SC.Logger.debug('All feeds fetched') ;
      
      //if (!SC.none(query._allFeeds)) store.loadRecords(Kiosque.Feed, query._allFeeds) ;
      //if (!SC.none(query._allArticles)) store.loadRecords(Kiosque.Article, query._allArticles) ;
      
      store.dataSourceDidFetchQuery(query) ;
      query.set('queryLoaded', YES) ;
      
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
    
    // TODO: Add handlers to submit new records to the data source.
    // call store.dataSourceDidComplete(storeKey) when done.
    
    return NO ; // return YES if you handled the storeKey
  },
  
  updateRecord: function(store, storeKey) {
    
    // TODO: Add handlers to submit modified record to the data source
    // call store.dataSourceDidComplete(storeKey) when done.

    return NO ; // return YES if you handled the storeKey
  },
  
  destroyRecord: function(store, storeKey) {
    
    // TODO: Add handlers to destroy records on the data source.
    // call store.dataSourceDidDestroy(storeKey) when done
    
    return NO ; // return YES if you handled the storeKey
  }
  
}) ;
