// ==========================================================================
// Project:   Kiosque.RssSource
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Kiosque.RssSource = SC.Record.extend(
/** @scope Kiosque.RssSource.prototype */ {

  primaryKey: 'url',
  name: SC.Record.attr(String),
  url: SC.Record.attr(String)

}) ;
