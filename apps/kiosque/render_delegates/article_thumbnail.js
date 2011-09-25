/* ==========================================================================
*  Project:   Kiosque
*  Copyright: @2011 Strobe, Inc.
*  ==========================================================================
*/


/**
  @class
  Renders and updates DOM representations of the label included in the article view
  @author Cherif Yaya
*/

SC.BaseTheme.articleThumbnailRenderDelegate = SC.RenderDelegate.create({
  className: '',
  
  render: function(dataSource, context) {
    this.addSizeClassName(dataSource, context);

    var html = this._htmlForContent(dataSource);
    context.push(html);
    
    // we could use didChangeFor, but in this case, checking the generated
    // HTML will probably be faster (and definitely be simpler)
    // because several properties are used.
    dataSource.get('renderState')._lastHTML = html;
  },
  
  update: function(dataSource, jquery) {
    this.updateSizeClassName(dataSource, jquery);

    var html = this._htmlForContent(dataSource);
    if (dataSource.get('renderState')._lastHTML !== html) {
      jquery.html(html);
      dataSource.get('renderState')._lastHTML = html;
    }
  },
  
  _htmlForContent: function(dataSource) {
    var content = dataSource.get('content'),
        title = content.get('title'),
        feed = content.getPath('source.name'),
        cover = content.get('cover') ;
        
    
    var feedHtml, titleHtml, coverHtml ; 
    
    feedHtml = '<div class="article-thumb-feed">%@</div>'.fmt(SC.RenderContext.escapeHTML(feed)) ;
    titleHtml = '<div class="article-thumb-title">%@</div>'.fmt(SC.RenderContext.escapeHTML(title)) ;
    
    
    return feedHtml + titleHtml;
  }
  
});
