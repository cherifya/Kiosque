// ==========================================================================
// Project:   Kiosque.articlesController
// Copyright: @2011 Strobe, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  This controller class manages tweets items

  @extends SC.ArrayController
*/
Kiosque.tweetsController = SC.ArrayController.create(
/** @scope Kiosque.tweetsController.prototype */ {

  content: null,
  selection: null,
  
  selectedUrl: null,
  maxTweets: 10,
  
  loadTweets: function() {
    var query,
        tweets = this.get('content'),
        selectedUrl = this.get('selectedUrl');
        
    if (SC.none(selectedUrl)) return ;
    
    if (!SC.none(tweets)) {
      //TODO remove all current tweets
      
    }
    query = SC.Query.local(Kiosque.Tweet, {
      orderBy: 'creationDate DESC',
      articleUrl: selectedUrl,
      maxTweets: this.get('maxTweets'),
      conditions: 'queryUrl = {selected}',
      parameters: {
        selected: selectedUrl
      }
    }) ;
    tweets = Kiosque.store.find(query) ;
    Kiosque.tweetsController.set('content', tweets) ;
  }.observes('selectedUrl')

}) ;