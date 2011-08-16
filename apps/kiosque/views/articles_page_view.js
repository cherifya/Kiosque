// ==========================================================================
// Project:   Kiosque.ArticlesPageView
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque */
require('views/article_thumbnail_view');
/** @class

  (Document Your View Here)

  @extends SC.View
*/
Kiosque.ArticlesPageView = SC.GridView.extend(
/** @scope Kiosque.ArticlesPageView.prototype */ {

  classNames: 'articles-grid-page'.w(),
  articlesGrid: null,
  layout: {top:0, left:0, right:0, bottom:0},
  content: null,
  contentValueKeyBinding: '*articlesGrid.contentValueKey',
  contentIconKey: '*articlesGrid.contentIconKey',
  selectionBinding: '*articlesGrid.selection',
  actionBinding: '*articlesGrid.action',
  targetBinding: '*articlesGrid.target',
  columnWidthBinding: '*articlesGrid.columnWidth',
  rowHeightBinding: '*articlesGrid.rowHeight',
  exampleView: Kiosque.ArticleThumbnailView.design(),
  canEditContent: NO,
  canDeleteContent: NO

});
