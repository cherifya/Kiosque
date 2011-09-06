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

  classNames: 'article-view'.w(),
  childViews: 'label closeButton'.w(),
  content: null,
  
  label: SC.LabelView.design({
    classNames: 'article-content'.w(),
    layout: {centerX:0, top:50, width: 600, height: 400},
    valueBinding: '*parentView.content.content',
    textAlign: SC.ALIGN_CENTER,
    escapeHTML: NO
  }),
  
  closeButton: SC.ButtonView.design({
    layout: {centerX:0, top: 480, height:40,width:100},
    title: 'Close',
    action: function() {
      Kiosque.statechart.sendEvent('close');
    }
  })

});
