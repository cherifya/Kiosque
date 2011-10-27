// ==========================================================================
// Project:   Tab
// Copyright: ©2010 Strobe, Inc.
// ==========================================================================
/*globals Tab */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/

Tab = SC.Application.create(
  /** @scope Tab.prototype */ {

  NAMESPACE: 'Tab',
  VERSION: '0.1.0',

  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.
  store: SC.Store.create().from(SC.Record.fixtures)
  
  // TODO: Add global constants or singleton objects needed by your app here.

}) ;

const DEV_MODE = true;

function trace(msg,prefix){
	if(!prefix) prefix = '';
	if(prefix) prefix = prefix + ' : ';
	
	if(msg == null){
		console.log(prefix + 'null');
		return ;
	}
	
	
	if(DEV_MODE){
		var tmp = '';
		if( (typeof msg) === 'object'){ 
			if(msg.isObject) console.log(prefix + msg.toString()); //SC object
			else{
				//JS object. print all properties
				console.log(prefix + serializeJSObject(msg));
			}
			
		}
		else console.log(prefix + msg);
	}
	
}
