// ==========================================================================
// Project:   Kiosque.ArticleView
// Copyright: @2011 Strobe, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  Represents the view used to display articles full screen.

  @author Cherif Yaya
  @extends SC.View
*/
Kiosque.ArticleView = SC.View.extend(
/** @scope Kiosque.ArticleView.prototype */ {

  classNames: 'article-container'.w(),
  childViews: 'label closeButton'.w(),
  content: null,
  
  label: SC.LabelView.design({
    classNames: 'article-content'.w(),
    layout: {top:96, left:21, right: 21, bottom: 96},
    valueBinding: '*parentView.content.content',
    textAlign: SC.ALIGN_CENTER,
    escapeHTML: NO
  }),
  
  closeButton: SC.ButtonView.design({
    layout: {left:0, top: 0, height:40,width:100},
    title: 'Close',
    action: function() {
      Kiosque.statechart.sendEvent('close');
    }
  })

});
