// ==========================================================================
// Project:   Kiosque.ArticleView
// Copyright: @2011 Strobe, Inc.
// ==========================================================================
/*globals Kiosque */
require('views/image_button');
/** @class

  Represents the view used to display articles full screen.

  @author Cherif Yaya
  @extends SC.View
*/
Kiosque.ArticleView = SC.View.extend(
/** @scope Kiosque.ArticleView.prototype */ {

  classNames: 'article-container'.w(),
  childViews: 'header scroll closeButton footer tweetsView'.w(),
  content: null,
  
  header: SC.View.design({
    layout: {top:0,right: 10,left: 10,height: 75},
    classNames: 'article-top'.w(),
    childViews: 'title'.w(),
    
    title: SC.LabelView.design({
      layout: {centerX:0,centerY:0,height:50,width:300},
      value: 'Kiosque',
      tagName: 'h1'
    })
    
  }),
  
  footer: SC.View.design({
    layout: {bottom:0, right: 0, left: 0, height: 75},
    classNames: 'article-footer'.w(),
    childViews: 'tweetsButton'.w(),
    
    tweetsButton: Kiosque.ImageButtonView.design({
      layout: {right:21, centerY: 0, height:40,width:40},
      value: sc_static('images/settings'),
      action: function() {
        Kiosque.statechart.sendEvent('tweets');
      }
    })
    
  }),
  
  /*
  scroll: SC.ScrollView.design({
    layout: {top:96, left:21, right: 21, bottom: 96},
    canScrollVertical: NO,
	  hasVerticalScroller: NO,
	  hasHorizontalScroller: NO,
	  alwaysBounceHorizontal: NO,
    alwaysBounceVertical: NO,
    contentBinding: '*parentView.content',
    
    contentView: SC.LabelView.design({
      classNames: 'article-content'.w(),
      //layout: {top:0,bottom:0,left:0},
      valueBinding: '*parentView.parentView.content.content',
      escapeHTML: NO,

      articleTitleBinding: '*parentView.parentView.content.title',
      articleAuthorBinding: '*parentView.parentView.content.author',
      articleDateBinding: '*parentView.parentView.content.publishedDate',
      articleLinkBinding: '*parentView.parentView.content.url',
      displayProperties: ['articleTitle', 'articleAuthor', 'articleDate', 'articleLink'],
      renderDelegateName: 'articleLabelRenderDelegate',
      
      shouldAutoResize: NO,
      widthDidChange: function() {
        var innerFrame = this.get('measuredSize') ;
        SC.Logger.debug('width: %@'.fmt(innerFrame.width)) ;
      }.observes('measuredSize')
    })
  }),
  */
  
  scroll: SC.LabelView.design({
    classNames: 'article-content'.w(),
    layout: {top:96, left:21, right: 21, bottom: 96},
    valueBinding: '*content.content',
    escapeHTML: NO,
    
    contentBinding: '*parentView.content',

    articleTitleBinding: '*content.title',
    articleAuthorBinding: '*content.author',
    articleDateBinding: '*content.publishedDate',
    articleLinkBinding: '*content.url',
    displayProperties: ['articleTitle', 'articleAuthor', 'articleDate', 'articleLink'],
    renderDelegateName: 'articleLabelRenderDelegate',
    
    shouldAutoResize: NO,
    widthDidChange: function() {
      var innerFrame = this.get('measuredSize') ;
      SC.Logger.debug('width: %@'.fmt(innerFrame.width)) ;
    }.observes('measuredSize')
  }),
  
  closeButton: Kiosque.ImageButtonView.design({
    layout: {left:0, top: 0, height:75,width:75},
    value: sc_static('images/back'),
    action: function() {
      Kiosque.statechart.sendEvent('close');
    }
  }),
  
  tweetsView: SC.View.design({
    layout: {right:0,bottom:0,left:0, top:0},
    isVisible: NO,
    classNames: 'article-tweets'.w(),
    childViews: 'wrapper'.w(),
    
    mouseDown: function() {
      return YES;
    },
    
    mouseUp: function() {
      Kiosque.statechart.sendEvent('closeTweets');
    },
    
    touchStart: function() {
      return this.mouseDown() ;
    },
    
    touchEnd: function() {
      return this.mouseUp() ;
    },
    
    wrapper: SC.View.design({
      layout: {left:0, right: 0, height: 400, bottom: 0},
      classNames: 'article-tweets-wrapper'.w(),
      childViews: 'headerView tweetsContainer'.w(),
      
      headerView: SC.View.design({
        layout: {top:0, right:0,left:0,height:65},
        classNames: 'article-tweets-header'.w(),
        childViews: 'titleView closeButton'.w(),

        titleView: SC.LabelView.design({
          layout: {left: 21, centerY: 0, height:21, right:60},
          classNames: 'article-tweets-title'.w(),
          value: 'Reactions'
        }),

        closeButton: Kiosque.ImageButtonView.design({
          layout: {right: 21, centerY: 0, height:40,width:40},
          value: sc_static('images/settings'),
          action: function() {
            Kiosque.statechart.sendEvent('closeTweets');
          }
        })
      }),

      tweetsContainer: SC.ScrollView.design({
        layout: {left:0, right: 0, top: 65, bottom: 0},
        canScrollVertical: YES,
    	  hasVerticalScroller: NO,
    	  hasHorizontalScroller: NO,
    	  alwaysBounceHorizontal: NO,
        alwaysBounceVertical: YES,

        contentView: SC.ListView.design({
          layout: {top:0,right:0,bottom:0,left:0},
          classNames: 'article-tweets-list'.w(),
          contentBinding: 'Kiosque.tweetsController.arrangedObjects',
          selectionBinding: 'Kiosque.tweetsController.selection',
          rowHeight: 70,
          exampleView: SC.LabelView.design({
            classNames: 'tweet'.w(),

            displayProperties: ['content'],
            renderDelegateName: 'customTweetRenderDelegate'
          })
        })
      })
      
    })
    
  })

});
