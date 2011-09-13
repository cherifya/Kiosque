// ==========================================================================
// Project:   Kiosque.sourcesController
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  Manages RSS sources

  @extends ArrayController
*/
Kiosque.sourcesController = SC.ArrayController.create(
/** @scope Kiosque.sourcesController.prototype */ {
  
  loadingData: NO,

  loadSources: function() {
    this.set('loadingData', YES) ;
    var controller = this,
        feeds = this.get('content') ;
        
    if (SC.none(feeds)) {
      var query = SC.Query.local(Kiosque.RssSource, {
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
