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
  
  SC.LOG_TOUCH_EVENTS = NO ;
} ;

Kiosque.initData = function() {
  Kiosque.feedsController.loadFeeds() ;
  
  Kiosque.articlesController.loadArticles() ;
} ;

function main() { Kiosque.main(); }

SC.ExceptionHandler.handleException = function(e) {
	SC.Logger.debug('Exception: %@'.fmt(e.message)) ;
	
	return YES; //Exception handled
};