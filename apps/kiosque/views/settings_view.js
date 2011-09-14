// ==========================================================================
// Project:   Kiosque.SettingsView
// Copyright: @2011 Strobe, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  Content view shown in Settings panel.

  @extends SC.View
*/
Kiosque.SettingsView = SC.View.extend(
/** @scope Kiosque.SettingsView.prototype */ {

  classNames: 'settings-panel'.w(),
  childViews: 'feedsLabel scroll nameLabel urlLabel nameField urlField addButton'.w(),
  
  feedsLabel: SC.LabelView.design({
    layout: {top:10,left:10,height:24,width:200},
    value: 'Feeds'
  }),
  
  scroll: SC.ScrollView.design({
    classNames: 'feeds'.w(),
    layout: {top:35,right:10,left:10,height:150},
    
    contentView: SC.GridView.design({
      layout: {top:0,right:0,bottom:0,left:0},
      contentBinding: 'Kiosque.sourcesController.arrangedObjects',
      //selectionBinding: 'Kiosque.sourcesController.selection'
      contentValueKey: 'name',
      columnWidth: 240,
      rowHeight: 25,
      canEditContent: YES,
      canDeleteContent: YES,
      exampleView: SC.LabelView.design({
        classNames: 'feed-label'.w()
      })
    })
  }),
  
  nameLabel: SC.LabelView.design({
    layout: {top:200,left:10,height:20,width:180},
    value: 'Name:'
  }),
  
  urlLabel: SC.LabelView.design({
    layout: {top:200,left:200,height:20,width:200},
    value: 'Url:'
  }),
  
  nameField: SC.TextFieldView.design({
    layout: {top:220,left: 10, height: 25,width:180},
    hint: 'Name...',
    isPassword: NO,
    isTextArea: NO
  }),
  
  urlField: SC.TextFieldView.design({
    layout: {top:220,left: 200, height: 25, right:10},
    hint: 'Url...',
    isPassword: NO,
    isTextArea: NO
  }),
  
  addButton: SC.ButtonView.design({
    layout: {bottom:10,right: 10, height:24,width:100},
    title: 'Add Feed',
    action: 'addNewFeed',
    target: 'Kiosque.sourcesController'
  })

});
