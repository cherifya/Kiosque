/* ==========================================================================
*  Project:   Kiosque
*  Copyright: @2011 Strobe, Inc.
*  ==========================================================================
*/


/**
  @class
  Renders and updates DOM representations of an image defined from a url resource.
  This render delegate positions the image so that it is centered in the parent container
  and its aspect ration is preserved.
  
  @author Cherif Yaya
*/

SC.BaseTheme.centerImageRenderDelegate = SC.RenderDelegate.create({
  name: 'image',

  render: function(dataSource, context) {
    var image = dataSource.get('image'),
        imageValue = dataSource.get('imageValue'),
        type = SC.IMAGE_TYPE_URL,
        toolTip = dataSource.get('toolTip');

    // Place the img within a div, so that we may scale & offset the img
    context = context.begin('div');

    if (imageValue && type === SC.IMAGE_TYPE_CSS_CLASS) {
      //context.addClass(imageValue);
      //this._last_class = imageValue;
    }

    if (toolTip) {
      context.attr('title', toolTip);
      context.attr('alt', toolTip);
    }

    // Adjust the layout of the img
    context.addStyle(this.imageStyles(dataSource));

    context = context.end();
  },

  update: function(dataSource, jquery) {
    var image = dataSource.get('image'),
        imageValue = dataSource.get('imageValue'),
        toolTip = dataSource.get('toolTip');

    jquery = jquery.find('div');
    //jquery.attr('src', image.src);

    //if (imageValue !== this._last_class) jquery.setClass(this._last_class, NO);
    if (imageValue) {
      //jquery.addClass(imageValue);
      //this._last_class = imageValue;
    }

    if (toolTip) {
      jquery.attr('title', toolTip);
      jquery.attr('alt', toolTip);
    }

    // Adjust the layout of the img
    jquery.css(this.imageStyles(dataSource));
    
    //set the image as background
    //we use background position 'center top' to center the image
    //we use background size 'cover' to make image fill all available space
  },

  imageStyles: function(dataSource) {
    var innerFrame = dataSource.get('innerFrame'),
        imageValue = dataSource.get('imageValue') ;
    return {
      'position': 'absolute',
      'left': Math.round(innerFrame.x),
      'top': Math.round(innerFrame.y),
      'width': Math.round(innerFrame.width),
      'height': Math.round(innerFrame.height),
      'background-image': 'url(%@)'.fmt(imageValue),
      'background-position': 'center top',
      'background-size': 'cover'
      //'-webkit-transform': 'translateZ(0)'
    };
  }

});
