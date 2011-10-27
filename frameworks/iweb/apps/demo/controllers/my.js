// ==========================================================================
// Project:   Tab.myController
// Copyright: ©2010 Strobe, Inc.
// ==========================================================================
/*globals Tab */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Tab.myController = SC.ObjectController.create(
/** @scope Tab.myController.prototype */
{

  swap: function() {
		
		var current;
    if(Tab.mainPage.mainPane.tabbedView.sceneView.nowShowing == 'master')
			current = 'detail';
		else current = 'master';
		console.log('swapping to '+current);
		Tab.mainPage.mainPane.tabbedView.sceneView.set('nowShowing',current);
  },

	pushYellow: function() {
		var navView = Tab.mainPage.mainPane.tabbedView.master1;
		
		navView.push(
			SC.View.create({
			  layout: { top: 0, right: 0, bottom: 0, left: 0 },
			  childViews: 'pushButton'.w(),
				backgroundColor: 'yellow',
				title: 'Yellow',
				
				topToolbar: SC.NavigationBarView.design({
				  childViews: 'labelView'.w(),
					tintColor: 'black',

					labelView: SC.LabelView.design({
					  layout: { centerX: 0, centerY: 0, width: 100, height: 24 },
					  value: 'Yellow',
						textAlign: SC.ALIGN_CENTER,
						controlSize: SC.HUGE_CONTROL_SIZE
					}),

					leftButton: SC.ButtonView.design({
					  layout: { left: 10, width: 70 },
					  title: 'Back',
					  action: 'popView',
					  target: 'Tab.myController',
						theme: 'point-left',
						controlSize: SC.HUGE_CONTROL_SIZE
					}),
				}),
				
				pushButton: SC.ButtonView.design({
				  layout: { centerX: 0, centerY: 0, width: 100, height: 30 },
				  title: 'Push Red',
				  action: 'pushRed',
				  target: 'Tab.myController',
					controlSize: SC.HUGE_CONTROL_SIZE
				})
			})
		);
	},
	
	pushRed: function() {
		var navView = Tab.mainPage.mainPane.tabbedView.master1;
		
		navView.push(
			SC.View.create({
			  layout: { top: 0, right: 0, bottom: 0, left: 0 },
			  childViews: 'labelBenin'.w(),
				backgroundColor: 'red',
				title: 'Red',
				
				topToolbar: SC.NavigationBarView.design({
				  childViews: 'labelView'.w(),

					labelView: SC.LabelView.design({
					  layout: { centerX: 0, centerY: 0, width: 100, height: 24 },
					  value: 'Red',
						textAlign: SC.ALIGN_CENTER,
						controlSize: SC.HUGE_CONTROL_SIZE
					}),

					leftButton: SC.ButtonView.design({
					  layout: { left: 10, width: 70 },
					  title: 'Back',
					  action: 'popView',
					  target: 'Tab.myController',
						theme: 'point-left',
						controlSize: SC.HUGE_CONTROL_SIZE
					}),
				}),
				
				labelBenin: SC.ButtonView.design({
				  layout: { centerX: 0, centerY: 0, width: 100, height: 30 },
				  title: 'NO-OP',
					controlSize: SC.HUGE_CONTROL_SIZE
				})
			})
		);
	},
	
	popView: function() {
		var navView = Tab.mainPage.mainPane.tabbedView.master1;
		navView.pop();
	}

});
