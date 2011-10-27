// ==========================================================================
// Project:   Kiosque.articlesController
// Copyright: @2011 Strobe, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  This controller class manages articles items

  @extends SC.ArrayController
*/
Kiosque.articlesController = SC.ArrayController.create(
/** @scope Kiosque.articlesController.prototype */ {

  content: null,
  selection: null,
  
  /**
	 Load all articles for all sources
   
	*/
  loadArticles: function() {
    var query,
        articles = this.get('content') ;
    
    if (SC.none(articles)) {
      query = SC.Query.local(Kiosque.Article, {
        orderBy: 'publishedDate DESC'
      }) ;
      articles = Kiosque.store.find(query) ;
      Kiosque.articlesController.set('content', articles) ;
    }
    else articles.refresh() ;
  },
  
  /**
	 Load articles for a specific source.
	 
	 @param {SC.Record} source Source record to load articles for 
	*/
  loadArticlesFromSource: function(source) {
    var query, feed,
        articles = this.get('content') ;
    
    feed = Kiosque.store.find(Kiosque.Feed, source.get('url')) ;
    
    this.set('content', feed.get('articles')) ;
    
  },
  
  /**
	 Open the article view when an article is selected.
	  
	*/
  selectionDidChange: function() {
    var selection = this.get('selection') ;
    if (selection && selection.get('length') > 0) {
      var article = selection.firstObject() ;
      
      Kiosque.statechart.sendEvent('openArticle', article) ;
    }
  }.observes('selection')

}) ;
