// ==========================================================================
// Project:   Kiosque.sourcesController
// Copyright: @2011 Strobe, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  Manages RSS sources

  @extends ArrayController
*/
Kiosque.sourcesController = SC.ArrayController.create(SC.CollectionViewDelegate,
/** @scope Kiosque.sourcesController.prototype */ {
  
  loadingData: NO,
  selection: null,

  /**
	 Loads all rss sources from the store.
	*/
  loadSources: function() {
    this.set('loadingData', YES) ;
    var controller = this,
        feeds = this.get('content') ;
        
    if (SC.none(feeds)) {
      var query = SC.Query.local(Kiosque.RssSource, {
        orderBy: 'name',
        isEditable: YES,
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
  
  /**
	 Restricts the displayed feeds to the selected source when the source changes.
	*/
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
    var panel = sender.parentView.parentView ;
    var name = panel.getPath('newFeedSection.nameField.value') ;
    var url = panel.getPath('newFeedSection.urlField.value') ;
    
    if (!SC.empty(name) && !SC.empty(url)) {
      SC.Logger.debug('add new feed %@, %@'.fmt(name, url)) ;
      var feed = Kiosque.store.createRecord(Kiosque.RssSource, {
        name: name,
        url: url
      }) ;
      
      feed.commitRecord() ;
    } 
    
    //hide new feed section
    Kiosque.settingsViewController.hideNewFeedSection(panel) ;
  },
  
  collectionViewDeleteContent: function(view, content, indexes) {
		//display warning message
		SC.AlertPane.warn({
		  message: "The RSS source will be permanently removed.",
		  description: "Do you wanna proceed?",
		  caption: null,
		  delegate: this,
		  buttons: [
		    { title: "Delete" },
		    { title: "Cancel" },
		    { title: null }
		  ],
			indexes: indexes
		});
    
	},
	
	deleteRecords: function(indexes) {
		// destroy the records
    var records = indexes.map(function(idx) {
      var ret = this.objectAt(idx);
      
			return ret;
    }, this);
    records.invoke('destroy').invoke('commitRecord');

    var selIndex = indexes.get('min')-1;
    if (selIndex<0) selIndex = 0;
    SC.Logger.debug('selIndex: %@'.fmt(selIndex)) ;
    var controller = this ;
    this.invokeLater(function() {
      controller.selectObject(this.objectAt(selIndex));
    }) ;
    
	},
	
	alertPaneDidDismiss: function(pane, status) {
		
    switch(status) {
      case SC.BUTTON1_STATUS:
				//OK Button
        var indexes = pane.get('indexes');
				this.deleteRecords(indexes);
        break;

      case SC.BUTTON2_STATUS:
        // CANCEL BUTTON
        break;

      case SC.BUTTON3_STATUS:
        //MORE INFO BUTTON
        break;
    }
  }

}) ;
