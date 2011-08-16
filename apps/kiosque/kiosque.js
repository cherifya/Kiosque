// ==========================================================================
// Project:   Kiosque
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque */

Kiosque = SC.Application.create({
  
  store: SC.Store.create().from('Kiosque.FixturesDataSource')
});

SC.ready(function() {
//  Kiosque.mainPane = SC.TemplatePane.append({
//    layerId: 'kiosque',
//    templateName: 'kiosque'
//  });
});

Kiosque.main = function main() {
  Kiosque.getPath('mainPage.mainPane').append() ;
  
  var articles = Kiosque.store.find(Kiosque.Article) ;
  Kiosque.articlesController.set('content', articles) ;
} ;

function main() { Kiosque.main(); }