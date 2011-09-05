/* ==========================================================================
*  Project:   Kiosque
*  Copyright: @2011 Strobe, Inc.
*  ==========================================================================
*/

/**
  @class
  Renders and updates DOM representations of an image using a canvas element.
  Using canvas to render image greatly improves performance.
  This renders needs to prevent the canvas from streching the image. Aspect ratio 
  has to be preserved.

  @author Cherif Yaya
*/

SC.BaseTheme.customCanvasImageRenderDelegate = SC.RenderDelegate.create({
  name: 'canvasImage',

  /** @private
    We don't have an element yet, so we do the minimal necessary setup
    here.
  */
  render: function(dataSource, context) {
    var width = dataSource.get('width') || 0,
        height = dataSource.get('height') || 0;

    context.attr('width', width);
    context.attr('height', height);
  },

  update: function(dataSource, jquery) {
    var elem = jquery[0],
        image = dataSource.get('image'),
        frame = dataSource.get('frame'),
        frameWidth = frame.width,
        frameHeight = frame.height,
        innerFrame = dataSource.get('innerFrame'),
        backgroundColor = dataSource.get('backgroundColor'),
        renderState = dataSource.get('renderState'),
        context;

    // We only care about specific values, check specifically for what matters
    var innerFrameDidChange = ![innerFrame.x, innerFrame.y, innerFrame.width, innerFrame.height].isEqual(renderState._lastInnerFrameValues),
        backgroundDidChange = dataSource.didChangeFor('customCanvasImageRenderDelegate', 'backgroundColor'),
        imageDidChange = dataSource.didChangeFor('customCanvasImageRenderDelegate', 'image') || (image && image.complete) !== renderState._lastImageComplete;

    if (innerFrameDidChange || backgroundDidChange || imageDidChange) {

      if (elem && elem.getContext) {
        elem.height = frameHeight;
        elem.width = frameWidth;

        context = elem.getContext('2d');

        context.clearRect(0, 0, frameWidth, frameHeight);

        if (backgroundColor) {
          context.fillStyle = backgroundColor;
          context.fillRect(0, 0, frameWidth, frameHeight);
        }

        if (image && image.complete) {
          context.drawImage(image, Math.floor(innerFrame.x), Math.floor(innerFrame.y), Math.floor(innerFrame.width), Math.floor(innerFrame.height));
        }
      }

      // Update caches
      renderState._lastInnerFrameValues = [innerFrame.x, innerFrame.y, innerFrame.width, innerFrame.height];
      renderState._lastImageComplete = image && image.complete;
    }
  }

});
