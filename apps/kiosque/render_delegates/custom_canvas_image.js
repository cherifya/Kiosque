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
  //name: 'canvasImage',

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
        backgroundColor = dataSource.get('fillWithWhite') || YES,
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
        
        //determine cropping size
        var sx = 0, sy = 0,
            sw = image.width, sh = image.height,
            dx = Math.floor(innerFrame.x), dy = Math.floor(innerFrame.y),
            dw = Math.floor(innerFrame.width), dh = Math.floor(innerFrame.height),
            cw, ch ;
        
        //if BLANK_IMAGE, do nothin
        if (sw == 1 && sh ==1) return ;
        
        //the area of the source we use will have the same ratio as the source image 
        //canvas so that no distortion occurs. 
        //It has an important feature. It's smaller than both source image and destination canvas
        cw = Math.min(sw, dw) ;
        ch = cw*sh/(sw*1.0) ;
        
        if (ch > dh) {
          ch = dh ;
          cw = cw*dh/(sh*1.0) ;
        }
           
        //now center source area on source image
        sx = Math.floor((sw - cw) / 2.0) ;
        sy = Math.floor((sh - ch) / 2.0) ;
        
        //and on canvas
        dx = Math.floor((dw - cw) / 2.0) ;
        dy = Math.floor((dh - ch) / 2.0) ;
        
        //apply pixels
        if (image && image.complete) {
          if (backgroundColor) {
            context.fillStyle = 'white';
            context.fillRect(0, 0, frameWidth, frameHeight);
          }
          context.drawImage(image, 0, 0, sw, sh, dx, dy, cw, ch);
        }
      }

      // Update caches
      renderState._lastInnerFrameValues = [innerFrame.x, innerFrame.y, innerFrame.width, innerFrame.height];
      renderState._lastImageComplete = image && image.complete;
    }
  }

});
