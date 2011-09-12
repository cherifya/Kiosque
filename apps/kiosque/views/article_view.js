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
  childViews: 'scroll closeButton'.w(),
  content: null,
  
  label: SC.LabelView.design({
    classNames: 'article-content'.w(),
    layout: {top:96, left:21, right: 21, bottom: 96},
    valueBinding: '*parentView.content.content',
    textAlign: SC.ALIGN_CENTER,
    escapeHTML: NO,
    
    articleTitleBinding: '*parentView.content.title',
    articleAuthorBinding: '*parentView.content.author',
    articleDateBinding: '*parentView.content.publishedDate',
    displayProperties: ['articleTitle', 'articleAuthor', 'articleDate'],
    renderDelegateName: 'articleLabelRenderDelegate'
  }),
  
  scroll: SC.ScrollView.design({
    layout: {top:96, left:21, right: 21, bottom: 96},
    canScrollVertical: NO,
	  hasVerticalScroller: NO,
	  hasHorizontalScroller: NO,
	  alwaysBounceHorizontal: NO,
    alwaysBounceVertical: NO,
    contentBinding: '*parentView.content',
    
    contentView: SC.LabelView.design(SC.AutoResize, {
      classNames: 'article-content'.w(),
      //layout: {top:0,bottom:0,left:0},
      valueBinding: '*parentView.parentView.content.content',
      escapeHTML: NO,

      articleTitleBinding: '*parentView.parentView.content.title',
      articleAuthorBinding: '*parentView.parentView.content.author',
      articleDateBinding: '*parentView.parentView.content.publishedDate',
      displayProperties: ['articleTitle', 'articleAuthor', 'articleDate'],
      renderDelegateName: 'articleLabelRenderDelegate',
      
      shouldAutoResize: NO,
      widthDidChange: function() {
        var innerFrame = this.get('measuredSize') ;
        SC.Logger.debug('width: %@'.fmt(innerFrame.width)) ;
      }.observes('measuredSize')
    })
  }),
  
  closeButton: Kiosque.ImageButtonView.design({
    layout: {left:0, top: 0, height:75,width:75},
    value: sc_static('images/back'),
    action: function() {
      Kiosque.statechart.sendEvent('close');
    }
  })

});
