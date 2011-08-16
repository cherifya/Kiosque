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
  
  //create carrousel data
  var thumbs = [];
  var thumbsNames = ['green', 'brown', 'yellow', 'red'];
  for (var i = 0; i < 4; i++){
    var thumb = SC.Object.create({
      name: thumbsNames[i],
      index: i
    });
    thumbs.push(thumb);
  }
  
  Kiosque.thumbsController.set('content',thumbs);
  
  var articles = Kiosque.store.find(Kiosque.Article) ;
  Kiosque.articlesController.set('content', articles) ;
} ;

function main() { Kiosque.main(); }