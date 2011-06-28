// ==========================================================================
// Project:   Tab - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Tab */

// This page describes the main user interface for your application.  
Tab.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    childViews: 'tabbedView'.w(),
    
    tabbedView: Iweb.ITabView.design({
			layout: { top: 0, left: 0, bottom: 0, width:320},			
			tabViews: "master1 master2 master3".w(),
			nowShowing: 'master1',
			
			master1: Iweb.INavigationView.design({
				tabBarItem: Iweb.ITabBarItem.create({
					title: "Controls",
					image: sc_static('images/music/controlsButton') 
				})
			}),
			
			master2: Iweb.ITableView.design({
				rowHeight: 44,
				contentValueKey: 'title',
				detailValueKey: 'artist',
				hasContentBranch: YES,
				contentIsBranchKey: 'isBranch',
				hasContentIcon: NO,
				contentIconKey: null,
				showAlternatingRows: YES,
				contentBinding: 'Tab.songsController.arrangedObjects',
			  selectionBinding: 'Tab.songsController.selection',
				tabBarItem: Iweb.ITabBarItem.create({
					title: "Playlists",
					image: sc_static('images/music/playlistButton') 
				})
			}),
			
			master3: SC.View.design({
			  layout: { top: 0, right: 0, bottom: 0, left: 0 },
			  childViews: ''.w(),
				backgroundColor: 'brown',
				tabBarItem: Iweb.ITabBarItem.create({
					title: "Search",
					image: sc_static('images/music/searchButton') 
				})
			})
    }),
  })

});
