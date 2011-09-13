// ==========================================================================
// Project:   Kiosque.SettingsView
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  Content view shown in Settings panel.

  @extends SC.View
*/
Kiosque.SettingsView = SC.View.extend(
/** @scope Kiosque.SettingsView.prototype */ {

  classNames: ''.w(),
  childViews: 'feedsLabel scroll'.w(),
  
  feedsLabel: SC.LabelView.design({
    layout: {top:10,left:10,height:24,width:200},
    value: 'Feeds'
  }),
  
  scroll: SC.ScrollView.design({
    layout: {top:50,right:10,left:10,height:150},
    
    contentView: SC.ListView.design({
      layout: {top:0,right:0,bottom:0,left:0},
      contentBinding: 'Kiosque.sourcesController.arrangedObjects',
      //selectionBinding: 'Kiosque.sourcesController.selection'
      contentValueKey: 'name'
    })
  })
  

});
