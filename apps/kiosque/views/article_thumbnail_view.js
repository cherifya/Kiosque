// ==========================================================================
// Project:   Kiosque.ArticleThumbnailView
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Kiosque.ArticleThumbnailView = SC.View.extend(
/** @scope Kiosque.ArticleThumbnailView.prototype */ {

  classNames: 'article-thumb'.w(),
  
  childViews: 'titleLabel cover'.w(),
  
  feedLabel: SC.LabelView.design({
    classNames: 'article-thumb-feed'.w(),
    layout: {left:10,top:10, height:25, width: 60},
    valueBinding: '*parentView.content.feeds'
  }),
  
  titleLabel: SC.LabelView.design({
    classNames: 'article-thumb-title'.w(),
    layout: {right:0,bottom:0, left:0, minHeight:40, maxHeight: 115},
    valueBinding: '*parentView.content.title'
  }),
  
  cover: SC.ImageView.design({
    classNames: 'article-thumb-cover'.w(),
    layout: { top: 0, right: 0, bottom: 0, left: 0 },
    useCanvas: YES,
    valueIsUrl: YES,
    renderDelegateName: 'customCanvasImageRenderDelegate',
    valueBinding: '*parentView.content.cover'
  })

});
