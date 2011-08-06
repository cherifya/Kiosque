// ==========================================================================
// Project:   Kiosque
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque */

Kiosque = SC.Application.create({
  
  store: SC.Store.create().from('Kiosque.FixturesDataSource')
});

SC.ready(function() {
  Kiosque.mainPane = SC.TemplatePane.append({
    layerId: 'kiosque',
    templateName: 'kiosque'
  });
});

Kiosque.main = function main() {

} ;

function main() { Kiosque.main(); }