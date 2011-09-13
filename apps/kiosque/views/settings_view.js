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
    layout: {top:50,right:10,left:10,height:150},
    
    contentView: SC.ListView.design({
      layout: {top:0,right:0,bottom:0,left:0},
      contentBinding: 'Kiosque.sourcesController.arrangedObjects',
      //selectionBinding: 'Kiosque.sourcesController.selection'
      contentValueKey: 'name'
    })
  }),
  
  nameLabel: SC.LabelView.design({
    layout: {top:210,left:10,height:20,width:180},
    value: 'Name:'
  }),
  
  urlLabel: SC.LabelView.design({
    layout: {top:210,left:200,height:20,width:200},
    value: 'Url:'
  }),
  
  nameField: SC.TextFieldView.design({
    layout: {top:235,left: 10, height: 30,width:180},
    hint: 'Name...',
    isPassword: NO,
    isTextArea: NO
  }),
  
  urlField: SC.TextFieldView.design({
    layout: {top:235,left: 200, height: 30, right:10},
    hint: 'Url...',
    isPassword: NO,
    isTextArea: NO
  }),
  
  addButton: SC.ButtonView.design({
    layout: {bottom:10,left: 10,height:24,width:100},
    title: 'New Feed',
    action: 'addNewFeed',
    target: 'Kiosque.sourcesController'
  })

});
