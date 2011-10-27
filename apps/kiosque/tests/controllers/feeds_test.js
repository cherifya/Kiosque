// ==========================================================================
// Project:   Kiosque.feedsController Unit Test
// Copyright: @2011 Strobe, Inc.
// ==========================================================================
/*globals Kiosque module test ok equals same stop start */


module("Kiosque.feedsController",{
  setup: function() {
    
  },
  
  tearDown: function() {
  }
});

test("Feeds TUAW is correctly loaded.", function() {
  var controller = Kiosque.feedsController ;
  controller.loadFeeds() ;
  stop(2000) ;
  
  controller.addObserver('loadingData', function(){
    start() ;
    
    var feed = controller.objectAt(0) ;

    ok(!SC.none(feed), "Feed should not be null") ;
    equals(feed.get('feedUrl'), 'http://www.tuaw.com/rss.xml', "Feed url should be the TUAW Rss url") ;
    var articles = feed.get('articles') ;
    //equals(articles.get('length'), 10, "Feed should have 10 articles") ;
  }) ;
  
  
});

