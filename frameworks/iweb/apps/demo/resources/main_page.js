// ==========================================================================
// Project:   Tab - mainPage
// Copyright: ©2010 Strobe, Inc.
// ==========================================================================
/*globals Tab Iweb */

// This page describes the main user interface for your application.  
Tab.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    childViews: 'tabbedView'.w(),
    
    tabbedView: Iweb.TabControlView.design({
			layout: { top: 0, left: 0, bottom: 0, right:0},			
			tabs: "master1 master3 master2 master4 master5".w(),
			nowShowing: 'master1',
			isTabBarVisible: YES,
			
			master1: Iweb.NavigationView.design({
				tabBarItem: Iweb.TabBarItem.create({
					title: "Navigation View",
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
				tabBarItem: Iweb.TabBarItem.create({
					title: "Playlists",
					image: sc_static('images/music/playlistButton') 
				})
			}),
			
			master3: SC.View.design({
			  layout: { top: 0, right: 0, bottom: 0, left: 0 },
			  childViews: ''.w(),
				backgroundColor: 'brown',
				tabBarItem: Iweb.TabBarItem.create({
					title: "Master Brown",
					image: sc_static('images/music/searchButton') 
				})
			}),
			
			master4: SC.View.design({
			  layout: { top: 0, right: 0, bottom: 0, left: 0 },
			  childViews: ''.w(),
				backgroundColor: 'yellow',
				tabBarItem: Iweb.TabBarItem.create({
					title: "Master Yellow",
					image: sc_static('images/music/searchButton') 
				})
			}),
			
			master5: SC.View.design({
			  layout: { top: 0, right: 0, bottom: 0, left: 0 },
			  childViews: ''.w(),
				backgroundColor: 'red',
				tabBarItem: Iweb.TabBarItem.create({
					title: "Master Red",
					image: sc_static('images/music/searchButton') 
				})
			})
    })
  })

});
