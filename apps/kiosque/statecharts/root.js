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
		    this.initData() ;
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
		}
	}),
	
	articles: SC.State.extend({
		enterState: function() {
		  var view = Kiosque.getPath('mainPage.mainPane.article') ;
		  view.set('content', Kiosque.articleController.get('content')) ;
		  
		  var jquery = view.$() ;
		  if (view.get('isVisible') === NO) {
		    jquery.css({
		      '-webkit-transform': 'scale3d(0,0,1)'
		    }) ;
		    view.set('isVisible',YES) ;
		  }
 		  
 		  //show view
 		  jquery.css({
	      '-webkit-transform': 'scale3d(1,1,1)'
	    }) ;
		  
		  this.set('view', view) ;
		},
		
		exitState: function() {
			var view = this.get('view');
			var jquery = view.$() ;
			//hide view
 		  jquery.css({
	      '-webkit-transform': 'scale3d(0,0,1)'
	    }) ;
			//view.set('isVisible', NO) ;
		},
		
		close: function() {
			this.gotoState('feeds');
		}
	})
});
