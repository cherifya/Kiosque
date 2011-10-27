// ==========================================================================
// Project:   Tab.Song
// Copyright: ©2010 Strobe, Inc.
// ==========================================================================
/*globals Tab */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Tab.Song = SC.Record.extend(
/** @scope Tab.Song.prototype */ {

  artist: SC.Record.attr(String),
	title: SC.Record.attr(String),
	model: SC.Record.attr(String)

}) ;
