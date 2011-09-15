// ==========================================================================
// Project:   Kiosque
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque */

Kiosque = SC.Application.create({
  
  store: SC.Store.create().from('Kiosque.FeedsDataSource')
});

SC.ready(function() {
  
});

Kiosque.main = function main() {
  Kiosque.getPath('mainPage.mainPane').append() ;
  
  Kiosque.statechart.initStatechart() ;
  
} ;

Kiosque.initData = function() {
  Kiosque.feedsController.loadFeeds() ;
  
  Kiosque.articlesController.loadArticles() ;
} ;

function main() { Kiosque.main(); }