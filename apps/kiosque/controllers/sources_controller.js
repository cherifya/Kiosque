// ==========================================================================
// Project:   Kiosque.sourcesController
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  Manages RSS sources

  @extends ArrayController
*/
Kiosque.sourcesController = SC.ArrayController.create(
/** @scope Kiosque.sourcesController.prototype */ {
  
  loadingData: NO,
  selection: null,

  loadSources: function() {
    this.set('loadingData', YES) ;
    var controller = this,
        feeds = this.get('content') ;
        
    if (SC.none(feeds)) {
      var query = SC.Query.local(Kiosque.RssSource, {
        orderBy: 'name',
        queryLoaded: NO,
        queryLoadedDidChange: function() {
          var queryLoaded = this.get('queryLoaded') ;
          if (queryLoaded) controller.set('loadingData', NO) ;
        }.observes('queryLoaded')
      }) ;
      feeds = Kiosque.store.find(query) ;
      this.set('content', feeds) ;
    }
    else feeds.refresh() ;
  },
  
  selectionDidChange: function() {
    var selection = this.get('selection') ;
    if (selection && selection.get('length') > 0) {
      var source = selection.firstObject() ;
      
      SC.Logger.debug('source: %@'.fmt(source.get('name'))) ;
      Kiosque.statechart.sendEvent('filterSource', source) ;
    }
  }.observes('selection'),
  
  showPickerPane: function(sender) {
    var pane = SC.PickerPane.create({
      layout: { width: 500, height: 300 },
      contentView: Kiosque.SettingsView.extend({
        layout: { top: 0, left: 0, bottom: 0, right: 0 }
      })
    });
    pane.popup(sender);
  },
  
  addNewFeed: function(sender) {
    var panel = sender.parentView ;
    var name = panel.getPath('nameField.value') ;
    var url = panel.getPath('urlField.value') ;
    
    if (!SC.empty(name) && !SC.empty(url)) {
      SC.Logger.debug('add new feed %@, %@'.fmt(name, url)) ;
      var feed = Kiosque.store.createRecord(Kiosque.RssSource, {
        name: name,
        url: url
      }) ;
      
      feed.commitRecord() ;
    }   
  }

}) ;
