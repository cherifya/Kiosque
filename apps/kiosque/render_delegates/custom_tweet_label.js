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

SC.BaseTheme.customTweetRenderDelegate = SC.RenderDelegate.create({
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
        tweet = dataSource.get('content'),
        tweetText = tweet.get('text'),
        tweetUser = tweet.get('user'),
        tweetDate = tweet.get('creationDate'),
        tweetImage = tweet.get('userImageUrl') ;
        
    
    if (!SC.none(tweetDate)) {
      //to local timezone
      tweetDate = tweetDate.toTimezone(SC.DateTime.timezone) ;
      tweetDate = tweetDate.toFormattedString('%Y/%m/%d %H:%M:%S') ;
    }
    
    var header = '<div class="tweet-image"><img src="%@"/></div><div class="tweet-info"><span class="user">%@</span><span class="date">%@</span></div><div class="tweet-text">%@</div>'.fmt(tweetImage, tweetUser, tweetDate, tweetText) ;
    
    return header ;
  }
  
});
