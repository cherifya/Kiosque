// ==========================================================================
// Project:   Tab - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Kiosque Iweb */
require('views/articles_grid_view');
require('views/article_view');
require('views/image_button');

// This page describes the main user interface for your application.  
Kiosque.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    childViews: 'header grid footer article'.w(),
    
    header: SC.View.design({
      layout: {top:0,right: 0,left: 0, height: 120},
      classNames: 'header'.w(),
      childViews: 'title feeds'.w(),

      title: SC.LabelView.design({
        layout: {left: 48,centerY:0,height:75,width:250},
        value: 'Kiosque',
        tagName: 'h1'
      }),
      
      feeds: Iweb.CarrouselView.design({
        classNames: 'feeds-view'.w(),
        layout: {left: 300, centerY: 0, right: 48, height: 50},
        maxWidth: 1024,
        contentValueKey: 'name',
        contentBinding: 'Kiosque.sourcesController.arrangedObjects',
        selectionBinding: 'Kiosque.sourcesController.selection',
        columnWidth: 200,
        rowHeight: 50,
        exampleView: SC.LabelView.design({
          classNames: 'feed-title'.w()
        })
      })

    }),
    
    grid: Kiosque.ArticlesGridView.design({
      layout: {top: 120, bottom: 100, left: 48, right: 48 },
      contentBinding: 'Kiosque.articlesController.content',
      contentValueKey: 'title',
      selectionBinding: 'Kiosque.articlesController.selection'
    }),
    
    footer: SC.View.design({
      layout: {bottom:0, right: 0, left: 0, height: 75},
      classNames: 'article-footer'.w(),
      childViews: 'feedsButton carrousel'.w(),
      
      feedsButton: Kiosque.ImageButtonView.design({
        layout: {bottom: 37,left:48, height:24,width:24},
        value: sc_static('images/settings'),
        action: 'showPickerPane',
        target: 'Kiosque.sourcesController'
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
      })
    }),
    
    article: Kiosque.ArticleView.design({
      isVisible: YES
    })
  })

});
