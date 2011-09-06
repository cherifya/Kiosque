// ==========================================================================
// Project:   Tab - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Kiosque Iweb */
require('views/articles_grid_view');
require('views/article_view');

// This page describes the main user interface for your application.  
Kiosque.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    childViews: 'grid carrousel article'.w(),
    
    grid: Kiosque.ArticlesGridView.design({
      layout: {top: 120, bottom: 100, left: 48, right: 48 },
      contentBinding: 'Kiosque.articlesController.content',
      contentValueKey: 'title',
      selectionBinding: 'Kiosque.articlesController.selection'
    }),
    
    carrousel: Iweb.CarrouselView.design({
      classNames: 'carrousel-view'.w(),
      layout: {bottom: 32, centerX: 0, width: 250, height: 35},
      maxWidth: 600,
      contentValueKey: 'name',
      contentBinding: 'Kiosque.thumbsController.arrangedObjects',
      selectionBinding: 'Kiosque.thumbsController.selection',
      columnWidth: 45,
      rowHeight: 30,
      exampleView: SC.LabelView.design({
        classNames: 'carrousel-label'.w()
      })
    }),
    
    article: Kiosque.ArticleView.design({
      isVisible: NO
    })
  })

});
