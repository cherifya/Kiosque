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
  nbPagesBinding: 'Kiosque.mainPage.mainPane.grid.numberOfPages',
  gridSelectedPageBinding: 'Kiosque.mainPage.mainPane.grid.currentTabIndex',
  
  gridSelectedPageDidChange: function() {
    var gridSelectedPage = this.get('gridSelectedPage') ;
    this.selectObject(this.objectAt(gridSelectedPage)) ;
  }.observes('gridSelectedPage'),
  
  selectionDidChange: function() {
    var selection = this.get('selection') ;
    var gridSelectedPage = this.get('gridSelectedPage') ;
    
    if (selection && selection.get('length') > 0) {
      var selected = selection.firstObject() ;
      
      var selectedIndex = selected.get('index') ;
      var tabControl = Kiosque.getPath('mainPage.mainPane.grid') ;
      if (tabControl && (selectedIndex != gridSelectedPage)) tabControl.navigateToTab(selectedIndex) ;
    }
  }.observes('selection'),
  
  content: function() {
    var pages = [],
        nbPages = this.get('nbPages'),
        i, item ;
    for (i=0; i<nbPages; i++) {
      item = SC.Object.create({
        name: ''+i,
        index: i
      }) ;
      pages.push(item) ;
    }
    return pages;
  }.property('nbPages')

}) ;
