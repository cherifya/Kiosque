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
  
  selectionDidChange: function() {
    var selection = this.get('selection') ;
    if (selection && selection.get('length') > 0) {
      var article = selection.firstObject() ;
      
      Kiosque.statechart.sendEvent('openArticle', article) ;
    }
  }.observes('selection')

}) ;
