// ==========================================================================
// Project:   Kiosque.Article
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  Articles model class. Feed objects contain list of articles.
  
  @author Cherif Yaya
  @extends SC.Record
  @version 0.1
*/
Kiosque.Article = SC.Record.extend(
/** @scope Kiosque.Article.prototype */ {

  title: SC.Record.attr(String),
  author: SC.Record.attr(String),
  summary: SC.Record.attr(String),
  updated: SC.Record.attr(SC.DateTime),
  url: SC.Record.attr(String),
  cover: SC.Record.attr(String),
  feeds: SC.Record.toMany('Kiosque', {isMaster: NO, inverse:'articles'})

}) ;
