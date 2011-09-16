// ==========================================================================
// Project:   Kiosque.settingsViewController
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Kiosque.settingsViewController = SC.ObjectController.create(
/** @scope Kiosque.settingsViewController.prototype */ {

  showNewFeedSection: function (sender) {
    var panel = sender.parentView.parentView ;
    panel.buttonsSection.set('isVisible', NO) ;
    panel.newFeedSection.set('isVisible', YES) ;
  },
  
  hideNewFeedSection: function (sender) {
    var panel = sender.parentView.parentView ;
    if (SC.none(panel)) panel = sender ;
    panel.buttonsSection.set('isVisible', YES) ;
    panel.newFeedSection.set('isVisible', NO) ;
  },
  
  deleteFeed: function(sender) {
    var panel = sender.parentView.parentView ;
    var collectionView = panel.scroll.contentView ;
    
    collectionView.deleteSelection() ;
  }

}) ;
