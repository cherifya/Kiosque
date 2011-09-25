// ==========================================================================
// Project:   Kiosque.ArticleThumbnailView
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Kiosque.ArticleThumbnailView = SC.ImageView.extend(
/** @scope Kiosque.ArticleThumbnailView.prototype */ {

  classNames: 'article-thumb'.w(),
  
  displayProperties: ['content'],
  renderDelegateName: 'customCanvasImageRenderDelegate',
  tagName: 'div'

});
