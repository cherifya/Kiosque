// ==========================================================================
// Project:   Kiosque.thumbscontroller
// Copyright: @2011 Strobe, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  Carrousel items controller

  @author Cherif Yaya
  @extends SC.ArrayController
*/
Kiosque.thumbsController = SC.ArrayController.create(
/** @scope Kiosque.thumbscontroller.prototype */ {
  
  selection: null,
  tabIndexBinding: 'Kiosque.mainPage.mainPane.tabbedView.currentTabIndex',
  
  selectionDidChange: function() {
    var selection = this.get('selection') ;
    
    if (selection && selection.get('length') > 0) {
      var selected = selection.firstObject() ;
      
      var selectedIndex = selected.get('index') ;
      var tabControl = Kiosque.getPath('mainPage.mainPane.tabbedView') ;
      if (tabControl) tabControl.navigateToTab(selectedIndex) ;
    }
  }.observes('selection'),
  
  tabIndexDidChange: function() {
    var tabIndex = this.get('tabIndex') ;
    this.selectObject(this.objectAt(tabIndex)) ;
  }.observes('tabIndex')

}) ;
