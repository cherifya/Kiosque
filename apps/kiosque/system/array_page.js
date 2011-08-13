// ==========================================================================
// Project:   Kiosque
// Copyright: @2011 Strobe, Inc.
// ==========================================================================
/*globals Kiosque */


/** @class

  This class implements a paging feature on a master array.
  A page array can be thought of as being a view on another (master) array.

  @author Cherif Yaya
  @extends SC.View
*/
Kiosque.ArrayPage = SC.Object.extend(SC.Array,
/** @scope Kiosque.ArrayPage.prototype */ {

  /**
    Master array of which this array is a page.
    
    @type Array
    @default null
  */
  masterArray: null,
  
  /**
    Number of items per page.
    
    @type Number
    @default null
  */
  itemsPerPage: null,
  
  /**
    Page index of this page array. Indexes are zero-based.
    
    @type Number
    @default null
  */
  pageIndex: null,
  
  // ..........................................................
  // ARRAY PRIMITIVES
  //

  /** @private
    Return the amount of items available in this page.
		@field
  */
  length: function() {
    var itemsPerPage = this.get('itemsPerPage'),
        pageIndex = this.get('pageIndex');
        
    if (pageIndex < 0 || itemsPerPage < 0) throw "pageIndex and itemsPerPage must be a positive integer" ;
    
    var totalItems = this.getPath('masterArray.length'),
        nbPages = Math.max(Math.ceil(totalItems*1.0/itemsPerPage), 1) ;
        
    if (pageIndex < (nbPages - 1)) return itemsPerPage ;
    else if (pageIndex === (nbPages - 1)) {
      var _start = pageIndex * itemsPerPage;
      return (totalItems - _start) ;
    }
    else return 0;
  }.property('itemsPerPage', 'pageIndex', '*masterArray.length'),
  
  /** @private
    @param {Number} idx Index of item to be retrieved
    @return Item at index idx
  */
  objectAt: function(idx) {
    var itemsPerPage = this.get('itemsPerPage'),
        pageIndex = this.get('pageIndex'),
        masterArray = this.get('masterArray'),
        indexInMaster = pageIndex * itemsPerPage + idx,
        length = this.get('length') ;
        
    if (SC.none(this.masterArray)) throw "ArrayPage : masterArray is null." ;
    if (pageIndex < 0 || itemsPerPage < 0) throw "ArrayPage: pageIndex and itemsPerPage must be a positive integer" ;
    
    if (idx >= length) return null ;
        
    return masterArray.objectAt(indexInMaster) ; 
  },
  
  /** @private
    @param {Number} idx Index of item to be retrieved
    @param {Number} amt Amount of objects to replace
    @param {Array} objects Objects to insert
  */
  replace: function(idx, amt, objects) {
    if (SC.none(this.masterArray)) throw "ArrayPage : masterArray is null." ;
    
    var itemsPerPage = this.get('itemsPerPage'),
        pageIndex = this.get('pageIndex'),
        masterArray = this.get('masterArray'),
        indexInMaster = pageIndex * itemsPerPage + idx ;

    var len = objects ? objects.get('length') : 0 ;

    // SC.Array implementations must call arrayContentWillChange
    // before making mutations. This allows observers to perform
    // operations based on the state of the Array before the
    // change, such as reflecting removals.
    this.arrayContentWillChange(idx, amt, len) ;
    this.beginPropertyChanges() ;

    // Mutate the underlying Array
    this.masterArray.replace(indexInMaster,amt,objects) ;

    // The length will update itself through binding to masterArray
    //this.set('length', this.content.length) ;

    // Call the general-purpose enumerableContentDidChange
    // Enumerable method.
    this.enumerableContentDidChange(idx, amt, len - amt) ;
    this.endPropertyChanges() ;

    // SC.Array implementations must call arrayContentDidChange
    // after making mutations. This allows observers to perform
    // operations based on the mutation. For instance, a listener
    // might want to reflect additions onto itself.
    this.arrayContentDidChange(idx, amt, len);
  }

});
