// ==========================================================================
// Project:   Tab - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals Kiosque Iweb */

// This page describes the main user interface for your application.  
Kiosque.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    childViews: 'tabbedView carrousel'.w(),
    
    tabbedView: Iweb.TabControlView.design({
			layout: { top: 20, centerX: 0, width: 600, height:400},			
			tabs: "master1 master3 master4 master5".w(),
			nowShowing: 'master3',
			isTabBarVisible: NO,
			
			master1: SC.View.design({
			  layout: { top: 0, right: 0, bottom: 0, left: 0 },
			  childViews: ''.w(),
				backgroundColor: 'green',
				tabBarItem: Iweb.TabBarItem.create({
					title: "Master Green",
					image: null 
				})
			}),
			
			master3: SC.View.design({
			  layout: { top: 0, right: 0, bottom: 0, left: 0 },
			  childViews: ''.w(),
				backgroundColor: 'brown',
				tabBarItem: Iweb.TabBarItem.create({
					title: "Master Brown",
					image: null 
				})
			}),
			
			master4: SC.View.design({
			  layout: { top: 0, right: 0, bottom: 0, left: 0 },
			  childViews: ''.w(),
				backgroundColor: 'yellow',
				tabBarItem: Iweb.TabBarItem.create({
					title: "Master Yellow",
					image: null 
				})
			}),
			
			master5: SC.View.design({
			  layout: { top: 0, right: 0, bottom: 0, left: 0 },
			  childViews: ''.w(),
				backgroundColor: 'red',
				tabBarItem: Iweb.TabBarItem.create({
					title: "Master Red",
					image: null 
				})
			})
    }),
    
    carrousel: Iweb.CarrouselView.design({
      classNames: 'carrousel-view'.w(),
      layout: {top:500, centerX:0, width:300, height:40},
      contentValueKey: 'name',
      contentBinding: 'Kiosque.thumbsController.arrangedObjects',
      selectionBinding: 'Kiosque.thumbsController.selection',
      columnWidth: 75,
      rowHeight: 40,
      exampleView: SC.LabelView.design({
        classNames: 'carrousel-label'.w()
      })
    })
  })

});
