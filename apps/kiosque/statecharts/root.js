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
		  this.initData() ;
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
		  var pane = Kiosque.getPath('mainPage.mainPane');
		  var view = pane.createChildView(Kiosque.ArticleView, {content: Kiosque.articleController.get('content')}) ;
			pane.appendChild(view) ;
		  //pane.append();
		  this.set('view',view);
		},
		
		exitState: function() {
			var view = this.get('view');
			view.removeFromParent();
		},
		
		close: function() {
			this.gotoState('feeds');
		}
	})
});
