// ==========================================================================
// Project:   Kiosque.Feed
// Copyright: @2011 Strobe, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  Represents the Feed model class. Feed objects contain list of articles.
  
  @author Cherif Yaya
  @extends SC.Record
  @version 0.1
*/
Kiosque.Feed = SC.Record.extend(
/** @scope Kiosque.Feed.prototype */ {

  title: SC.Record.attr(String),
  description: SC.Record.attr(String),
  updated: SC.Record.attr(SC.Datetime),
  articles: SC.Record.toMany('Kiosque.Article', { isMaster:YES, inverse: 'feeds'}),
  feedUrl: SC.Record.attr(SC.String),
  link: SC.Record.attr(SC.String)

}) ;
