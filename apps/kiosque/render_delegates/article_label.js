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

SC.BaseTheme.articleLabelRenderDelegate = SC.RenderDelegate.create({
  className: 'label',
  
  render: function(dataSource, context) {
    this.addSizeClassName(dataSource, context);
    
    var toolTip = dataSource.get('toolTip');
    if (toolTip) {
      context.attr('title', toolTip);
    }

    /*
      TODO [CC @ 1.5] These properties have been deprecated. We should remove them
            in the next release
    */
    context.addStyle({
      fontWeight: dataSource.get('fontWeight') || null,
      textAlign: dataSource.get('textAlign') || null
    });
    
    context.setClass('ellipsis', dataSource.get('needsEllipsis') || NO);
    context.setClass('icon', dataSource.get('icon') || NO);

    var html = this._htmlForTitleAndIcon(dataSource);
    context.push(html);
    
    // we could use didChangeFor, but in this case, checking the generated
    // HTML will probably be faster (and definitely be simpler)
    // because several properties are used.
    dataSource.get('renderState')._lastHTMLForTitleAndIcon = html;
  },
  
  update: function(dataSource, jquery) {
    this.updateSizeClassName(dataSource, jquery);

    /*
      TODO [CC @ 1.5] These properties have been deprecated. We should remove them
            in the next release
    */
    jquery.css({
      fontWeight: dataSource.get('fontWeight') || null,
      textAlign: dataSource.get('textAlign') || null
    });
    
    var toolTip = dataSource.get('toolTip');
    if (toolTip) {
      jquery.attr('title', toolTip);
    }
    else {
      jquery.removeAttr('title');
    }
    
    jquery.setClass('ellipsis', dataSource.get('needsEllipsis') || NO);

    var html = this._htmlForTitleAndIcon(dataSource);
    if (dataSource.get('renderState')._lastHTMLForTitleAndIcon !== html) {
      jquery.html(html);
      dataSource.get('renderState')._lastHTMLForTitleAndIcon = html;
    }
  },
  
  _htmlForTitleAndIcon: function(dataSource) {
    var title = dataSource.get('title'),
        hint = dataSource.get('hint'),
        escapeHTML = dataSource.get('escapeHTML'),
        icon = dataSource.get('icon') || '',
        articleTitle = dataSource.get('articleTitle'),
        articleAuthor = dataSource.get('articleAuthor'),
        articleDate = dataSource.get('articleDate'),
        articleLink = dataSource.get('articleLink');
        
    
    if (!SC.none(articleDate)) {
      //to local timezone
      articleDate = articleDate.toTimezone(SC.DateTime.timezone) ;
      articleDate = articleDate.toFormattedString('%A, %b %d, %Y %i:%M %p') ;
    }
    
    var header = '<div class="article-header"><a href="%@" target="_blank"><span class="title">%@</span></a><div class="byline"><span class="author">%@</span><span class="date">%@</span></div></div>'.fmt(articleLink, articleTitle, articleAuthor, articleDate) ;

    // Escape the title of the button if needed. This prevents potential
    // XSS attacks.
    if (title && escapeHTML) {
      title = SC.RenderContext.escapeHTML(title) ;
    }

    if (hint && !title) {
      if (escapeHTML) hint = SC.RenderContext.escapeHTML(hint);
      title = "<span class='sc-hint'>" + hint + "</span>";
    }

    if (icon) {
      // If the icon property is the path to an image, create an image tag
      // that points to that URL.
      if (icon.indexOf('/') >= 0) {
        icon = '<img src="'+icon+'" alt="" class="icon" />';

      // Otherwise, the icon property is a class name that should be added
      // to the image tag. Display a blank image so that the user can add
      // background image using CSS.
      } else {
        icon = '<img src="'+SC.BLANK_IMAGE_URL+'" alt="" class="icon '+icon+'" />';
      }
    }
    
    return icon + header + title;
  }
  
});
