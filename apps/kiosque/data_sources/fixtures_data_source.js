// ==========================================================================
// Project:   Kiosque.FixturesDataSource
// Copyright: @2011 My Company, Inc.
// ==========================================================================
/*globals Kiosque */

/** @class

  (Document Your Data Source Here)

  @extends SC.FixturesDataSource
*/
Kiosque.FixturesDataSource = SC.FixturesDataSource.extend(
/** @scope Kiosque.FixturesDataSource.prototype */ {
  simulateRemoteResponse: YES,

  latency: 500 // 500 ms latency
  
}) ;
