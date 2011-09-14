/* ==========================================================================
*  Project:   Kiosque
*  Copyright: @2011 Strobe, Inc.
*  ==========================================================================
*/
/*globals Kiosque */

/**
  @class
  Root statechart of the app.

  @author Cherif Yaya
*/
Kiosque.statechart = SC.Statechart.create({
	initialState: 'feeds',
	
	feeds: SC.State.extend({
		enterState: function() {
		  if (!this._dataLoaded) {
		    Kiosque.sourcesController.loadSources() ;
		    //Since loading feeds from cookies is pretty much synchronous
		    //we can do this. but needs to be fixed with true async behavior 
		    //TODO add async loading of data in case feeds list is read across the pipes
		    this.invokeLast('initData') ;
		    this._dataLoaded = YES ;
		  }
		},
		
		initData: function() {
      Kiosque.feedsController.loadFeeds() ;

      Kiosque.articlesController.loadArticles() ;
    },
		
		exitState: function() {
			//this.get('pane').remove();
		},
		
		openArticle: function(article) {
		  if (SC.none(article)) return ;
		  Kiosque.articleController.set('content', article) ;
			this.gotoState('articles');
		},
		
		filterSource: function(source) {
		  if (!SC.none(source)) {
		    Kiosque.articlesController.loadArticlesFromSource(source) ;
		  }
		}
	}),
	
	articles: SC.State.extend({
		enterState: function() {
		  var view = Kiosque.getPath('mainPage.mainPane.article') ;
		  view.set('content', Kiosque.articleController.get('content')) ;
		  
		  var jquery = view.$() ;
		  if (view.get('isVisible') === NO) {
		    view.set('isVisible',YES) ;
		  }
 		  
 		  //show view
 		  jquery.addClass('article-visible') ;
		  
		  this.set('view', view) ;
		},
		
		exitState: function() {
			var view = this.get('view');
			var jquery = view.$() ;
			//hide view
 		  jquery.removeClass('article-visible') ;
			//view.set('isVisible', NO) ;
		},
		
		close: function() {
			this.gotoState('feeds');
		}
	})
});
