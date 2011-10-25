// ==========================================================================
// Project:   Kiosque.RssSource
// Copyright: @2011 Strobe, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  Encapsulates a tweet and all of its attributes.

  @extends SC.Record
  @version 0.1
*/
Kiosque.Tweet = SC.Record.extend(
/** @scope Kiosque.Tweet.prototype */ {

  primaryKey: 'id_str',
  user: SC.Record.attr(String, { key: 'from_user' }),
  userId: SC.Record.attr(String, { key: 'from_user_id_str' }),
  userImageUrl: SC.Record.attr(String, { key: 'profile_image_url' }),
  creationDate: SC.Record.attr(SC.DateTime, { key: 'created_at', format: '%a, %d %b %Y %H:%M:%S %Z' }),
  text: SC.Record.attr(String)

}) ;