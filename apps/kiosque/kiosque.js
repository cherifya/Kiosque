// ==========================================================================
// Project:   Kiosque
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque */

Kiosque = SC.Application.create({
  
  store: SC.Store.create().from('Kiosque.FeedsDataSource')
});

SC.ready(function() {

  Kiosque.initData() ;
});

Kiosque.main = function main() {
  Kiosque.getPath('mainPage.mainPane').append() ;
  
} ;

Kiosque.initData = function() {
  Kiosque.feedsController.loadFeeds() ;
  
  var articles = Kiosque.store.find(Kiosque.Article) ;
  Kiosque.articlesController.set('content', articles) ;
} ;

function main() { Kiosque.main(); }