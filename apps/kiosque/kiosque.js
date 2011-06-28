// ==========================================================================
// Project:   Kiosque
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque */

Kiosque = SC.Application.create();

SC.ready(function() {
  Kiosque.mainPane = SC.TemplatePane.append({
    layerId: 'kiosque',
    templateName: 'kiosque'
  });
});
