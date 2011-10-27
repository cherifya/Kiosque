// ==========================================================================
// Project:   Kiosque.Article
// Copyright: @2011 Strobe, Inc.
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
  snippet: SC.Record.attr(String, { key: 'contentSnippet' }),
  content: SC.Record.attr(String, { key: 'content' }),
  publishedDate: SC.Record.attr(SC.DateTime, { format: '%a, %d %b %Y %H:%M:%S %Z' }),
  url: SC.Record.attr(String, { key: 'link' }),
  feeds: SC.Record.toMany('Kiosque.Feed', {isMaster: NO, inverse:'articles'}),
  source: SC.Record.toOne('Kiosque.RssSource'),
  
  /**
	 Search the article content and use the first encountered image as the image cover.
	 
	 @return {String} tab Url to the cover image for this article
	*/
  cover: function() {
    var content = this.get('content') ;
    var cover = null ;
    
    var matches = content.match(/src="(.*?)"/) ;
    if (matches && matches.get('length') >= 2) {
      //use first image of article as cover image
      cover = matches[1] ;
    }
    
    return cover ;
  }.property('content').cacheable()

}) ;
