// ==========================================================================
// Project:   Kiosque Unit Test
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque module test ok equals same stop start */

var globalArray;
module("Kiosque", {
  setup: function() {
    var item;
    globalArray = [];
    for (var i=0; i< 105; i++) {
      item = SC.Object.create({name: 'item '+i, index: i}) ;
      globalArray.push(item) ;
    }
  },
  
  tearDown: function() {
    globalArray = null;
  }
});

test("ArrayPage creation with pageIndex 0", function() {
  var arrayPage = Kiosque.ArrayPage.create({
    masterArray: globalArray,
    itemsPerPage: 10,
    pageIndex: 0 
  });
  
  equals(arrayPage.get('length'), 10, "Array page 0 should have 10 items.");
  
  var item;
  item = arrayPage.objectAt(0);
  equals(item.get('index'), 0, "Item 0 of Array page 0 should have index 0.");
  item = arrayPage.objectAt(8);
  equals(item.get('index'), 8, "Item 8 of Array page 0 should have index 8.");
  item = arrayPage.objectAt(10);
  equals(item, null, "Array page 0 should not have item beyond index 9.");
});

test("ArrayPage creation with pageIndex 4", function() {
  var arrayPage = Kiosque.ArrayPage.create({
    masterArray: globalArray,
    itemsPerPage: 10,
    pageIndex: 4
  });
  
  equals(arrayPage.get('length'), 10, "Array page 4 should have 10 items.");
  
  var item;
  item = arrayPage.objectAt(0);
  equals(item.get('index'), 40, "Item 0 of 5th Array page  should have index 40.");
  item = arrayPage.objectAt(5);
  equals(item.get('index'), 45, "Item 5 of  5th Array page should have index 45.");
  item = arrayPage.objectAt(10);
  equals(item, null, "5th Array page should not have item beyond index 9.");
});

test("ArrayPage creation with for last page", function() {
  var arrayPage = Kiosque.ArrayPage.create({
    masterArray: globalArray,
    itemsPerPage: 10,
    pageIndex: 10
  });
  
  equals(arrayPage.get('length'), 5, "Last Array page should have 5 items.");
  
  var item;
  item = arrayPage.objectAt(0);
  equals(item.get('index'), 100, "Item at position 0 of Array page 11 should have index 100.");
  item = arrayPage.objectAt(4);
  equals(item.get('index'), 104, "Item at position 4 of Array page 11 should have index 104.");
  item = arrayPage.objectAt(10);
  equals(item, null, "Array page 11 should not have item beyond position 4.");
});

test("Last ArrayPage should update when items are added to Master Array", function() {
  var arrayPage = Kiosque.ArrayPage.create({
    masterArray: globalArray,
    itemsPerPage: 10,
    pageIndex: 10
  });
  
  equals(arrayPage.get('length'), 5, "Last Array page should have 5 items initially");
  
  var item;
  item = arrayPage.lastObject();
  equals(item.get('index'), 104, "Last item of Array page 11 should have index 104");
  
  //add an object at end of master array
  SC.RunLoop.begin();
  globalArray.push(SC.Object.create({name: 'item 105', index: 105}));
  SC.RunLoop.end();
  
  equals(globalArray.get('length'), 106, "Global Array page should have 106 items after push()");
  equals(arrayPage.get('length'), 6, "Last Array page should have 6 items after push() to master array");
  item = arrayPage.lastObject();
  equals(item.get('index'), 105, "Last item of Array page 11 should now have index 105");
});

test("ArrayPage items should reflect change in master array after insertion", function() {
  var arrayPage = Kiosque.ArrayPage.create({
    masterArray: globalArray,
    itemsPerPage: 10,
    pageIndex: 2
  });
  
  equals(arrayPage.get('length'), 10, "Array page 2 should have 10 items");
  
  var item, masterItem;
  item = arrayPage.objectAt(6);
  equals(item.get('index'), 26, "Item at position 6 of Array page 2 should have index 26");
  masterItem = globalArray.objectAt(26);
  equals(masterItem.get('index'), 26, "Item at position 26 of Master Array should have index 26");
  
  //update index in item of master array
  SC.RunLoop.begin();
  globalArray.insertAt(5,SC.Object.create({name: 'item ET', index: 10000}));
  SC.RunLoop.end();
  masterItem = globalArray.objectAt(26);
  equals(masterItem.get('index'), 25, "Item at position 26 of Master Array should have index 25 after insertion.");
  //should cascade down to array page
  item = arrayPage.objectAt(6);
  equals(item.get('index'), 25, "Item in array page should reflect insertion in Master Array");
  
  var lastPage = Kiosque.ArrayPage.create({
    masterArray: globalArray,
    itemsPerPage: 10,
    pageIndex: 10
  });
  equals(lastPage.get('length'), 6, "Last array should have 7 items after insertAt()");
});

