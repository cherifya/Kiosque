// ==========================================================================
// Project:   Kiosque.preferencesController
// Copyright: ©2011 Strobe, Inc.
// ==========================================================================
/*globals Kiosque cocoaPreferences trace createCookie readCookie resetCookie serializeJSObject*/

/** @class

  Manages read/write access to application preferences. Preferences are persisted 
  using cookies.

  @extends SC.Object
*/
Kiosque.preferencesController = SC.ObjectController.create(
/** @scope ZicTube.preferencesController.prototype */ {
	/**
	 Reads saved feeds from the persistence storage (cookies at the moment)
	 
	 @return {SC.Array} Array containing all saved feeds
	*/
	feeds: function(key, value) {
    
		//read value
		var _feeds = this.readPreference('feeds') ;
	  if (SC.none(_feeds) || (_feeds.get('length') === 0)) {
	    this.addFeed([
	      {name:'Tuaw', url:'http://www.tuaw.com/rss.xml'}
	      ]) ;
	    _feeds = this.readPreference('feeds') ;
	  }
		return _feeds ;
	}.property(),
	
	/**
	 Add the passed feeds to the persistence storage.
	 
	 @param {SC.Array|Object} feeds List of feeds to save
	*/
	addFeed: function(feeds) {
	  if(SC.none(feeds)) return ;
	  if (SC.typeOf(feeds) !== SC.T_ARRAY) feeds = [feeds] ;
	  
	  var _feeds = this.readPreference('feeds') ;
	  if (SC.none(_feeds)) _feeds = [] ;
	  
	  for (var i = 0; i<feeds.get('length'); i++) {
	    var feed = feeds[i] ;
	    _feeds.push(feed) ;
	  }
	  
	  this.setPreference('feeds', _feeds) ;
	},
	
	/**
	 Remove passed feed from the saved feeds.
	 
	 @param {Object} feed Feed to remove 
	*/
	removeFeed: function(feed) {
	  if(SC.none(feed)) return ;
	  
	  var _feeds = this.readPreference('feeds') ;
	  if (SC.none(_feeds)) return ; //nothing to do
	  
	  var i, _feed, found ;
	  for (i = 0; i<_feeds.length; i++) {
	    _feed = _feeds[i] ;
	    if (_feed.name === feed.name && _feed.url === feed.url) {
	      found = _feed ;
	      break ;
	    }
	  }
	  
	  if(!SC.none(found)) _feeds.removeObject(found) ;
	  
	  this.setPreference('feeds', _feeds) ;
	},
	
	/**
	 Remove all saved feeds from the persistence storage.
	 
	 @param {SC.View} tab View to be added as a new tab 
	*/
	resetFeeds: function() {
	  resetCookie('feeds') ;
	},
	
	/**
	 Save the passed key value pair as a browser cookie valid for 60 days.
	 Offers a persistence layer for storing preferences.
	 
	 @param {String} prefName Preference name
	 @param {Object} prefValue Preference value
	*/
	setPreference: function(prefName, prefValue) {
		createCookie(prefName, serializeJSObject(prefValue), 60) ;
	},
	
	/**
	 Read the preference with the passed name.
	 
	 @param {String} prefName Name of preference to read 
	*/
	readPreference: function(prefName) {
		var prefValue = readCookie(prefName) ;
		prefValue = eval(prefValue) ;
		return prefValue ;
	}

}) ;

/* COOKIES  */

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) === 0) {
		  var ret = c.substring(nameEQ.length,c.length);
		  //ret = eval(ret);
		  return ret;
		}
	}
	return null;
}

function resetCookie(name) {
	createCookie(name,"",-1) ;
}

//This function returns a JSON formatted representation ot the passed argument
function serializeJSObject(_obj)
{
	 if (_obj === null) return 'null';
   // Other browsers must do it the hard way
   switch (typeof _obj)
   {
      // numbers, booleans, and functions are trivial:
      // just return the object itself since its default .toString()
      // gives us exactly what we want
      case 'number':
      case 'boolean':
      case 'function':
         return _obj;

      // for JSON format, strings need to be wrapped in quotes
      case 'string':
         return '\'' + _obj + '\'';

      case 'object':
         var str;
         if (_obj.constructor === Array || typeof _obj.callee !== 'undefined')
         {
            str = '[';
            var i, len = _obj.length;
            if (len === 0) return '[]' ;
            for (i = 0; i < len-1; i++) { str += serializeJSObject(_obj[i]) + ','; }
            str += serializeJSObject(_obj[i]) + ']';
         }
         else
         {
            str = '{';
            var key;
            for (key in _obj) { str += key + ':' + serializeJSObject(_obj[key]) + ','; }
            str = str.replace(/\,$/, '') + '}';
         }
         return str;

      default:
         return 'UNKNOWN';
   }
}
