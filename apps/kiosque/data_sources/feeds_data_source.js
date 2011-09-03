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
      var url = query.get('feedUrl') ;
      var dataSource = this ;
      var max = 45 ;
      
      //We use jQuery because we need JSONP support
      jQuery.ajax({
        url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=%@&q=%@'.fmt(max, encodeURIComponent(url)),
        dataType: 'jsonp',
        context: dataSource,
        success: function(response) {
          SC.RunLoop.begin();
          dataSource.didFetchFeeds(response, store, query);
          SC.RunLoop.end();
        },
        error: function(jqXHR) {
          SC.RunLoop.begin();
          store.dataSourceDidErrorQuery(query, null) ;
          query.set('queryLoaded', YES) ;
          SC.RunLoop.end();
        }
      });
      
      return YES ;
    }
    
    return NO ; // return YES if you handled the query
  },
  
  didFetchFeeds: function(response, store, query) {
    SC.Logger.debug('didFetchFeeds') ;
    var feed = response.responseData.feed ;
    var entries = feed.entries ;
    feed.guid = feed.feedUrl ;
    delete feed.entries ;
    
    var articlesIds = entries.getEach('link') ;
    entries.forEach(function(x) {
      x.guid = x.link ;
      x.feeds = feed.guid ;
    }) ;
    
    feed.articles = articlesIds ;
    
    store.loadRecords(Kiosque.Feed, [feed]) ;
    store.loadRecords(Kiosque.Article, entries) ;
    
    store.dataSourceDidFetchQuery(query) ;
    query.set('queryLoaded', YES) ;
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
