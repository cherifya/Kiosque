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
		  this.showSpinner() ;
		  
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
		},
		
		showSpinner: function() {
		  var pane = this.get('loadingPane') ;
		  
		  if (pane && pane.get('isPaneAttached')) return;
      
      if (SC.none(pane)) {
        pane = SC.PalettePane.create({
          classNames: 'spinner-panel'.w(),
          layout: { width: 70, height: 70, centerX: 0, centerY: 0 },
          contentView: SC.View.extend({
            layout: { top: 0, left: 0, bottom: 0, right: 0 },
            childViews: 'imageView'.w(),

            imageView: SC.ImageView.design({
              layout: { centerX: 0, centerY: 0, width: 24, height: 24 },
              value: sc_static('images/spinner-black'),
              useCanvas: NO
            })
          })
        });
      }
      
      pane.append();
      this.setIfChanged('loadingPane', pane);
		},
		
		hideSpinner: function() {
		  var pane = this.get('loadingPane') ;
		  if (pane && pane.get('isPaneAttached')) {
		    pane.remove() ;
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
		},
		
		tweets: function() {
		  SC.Logger.debug('tweets') ;
			var view = this.get('view') ;
			var tweetsView = view.get('tweetsView') ;
			
			if (tweetsView.get('isVisible') === NO) {
		    tweetsView.set('isVisible',YES) ;
		  }
		  
		  var articleUrl = Kiosque.articleController.getPath('content.url') ;
		  Kiosque.tweetsController.set('selectedUrl', articleUrl) ;
		  
		  var jquery = tweetsView.$() ;
		  jquery.addClass('tweets-visible') ;
		},
		
		closeTweets: function() {
			var view = this.get('view') ;
			var tweetsView = view.get('tweetsView') ;
		  
		  var jquery = tweetsView.$() ;
		  jquery.removeClass('tweets-visible') ;
		}
	})
});
