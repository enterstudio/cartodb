var _ = require('underscore');
var GeocodeStuff = require('../../../../../../javascripts/cartodb/common/dialogs/georeference/geocode_stuff');

describe('common/dialog/georeference/geocode_stuff', function() {
  beforeEach(function() {
    this.geocodeStuff = new GeocodeStuff('table_name');
  });

  describe('.isLocationWorld', function() {
    it('should return true or false depending on given location and if it is a free text value', function() {
      expect(this.geocodeStuff.isLocationWorld()).toBe(true);
      expect(this.geocodeStuff.isLocationWorld('')).toBe(true);

      // migrated from old code, unclear to why the word world appearing in the field is relevant
      expect(this.geocodeStuff.isLocationWorld('some world we live in', true)).toBe(true);

      // e.g. when selected a location that exists in table
      expect(this.geocodeStuff.isLocationWorld('some_column')).toBe(false);
      expect(this.geocodeStuff.isLocationWorld('some_column', true)).toBe(false);
      expect(this.geocodeStuff.isLocationWorld('some_column', false)).toBe(false);
    });
  });

  describe('.availableGeometriesFetchData', function() {
    it('should return a object hash with expected props based on given input', function() {
      expect(this.geocodeStuff.availableGeometriesFetchData('kind')).toEqual(jasmine.objectContaining({
        kind: 'kind',
        free_text: 'World'
      }));

      expect(this.geocodeStuff.availableGeometriesFetchData('kind', 'othercol', true)).toEqual(jasmine.objectContaining({
        kind: 'kind',
        free_text: 'othercol'
      }));

      var defaultForColumn = {
        kind: 'kind',
        column_name: 'othercol',
        table_name: 'table_name'
      };
      expect(this.geocodeStuff.availableGeometriesFetchData('kind', 'othercol')).toEqual(jasmine.objectContaining(defaultForColumn));
      expect(this.geocodeStuff.availableGeometriesFetchData('kind', 'othercol', false)).toEqual(jasmine.objectContaining(defaultForColumn));
    });
  });

  describe('.geocodingChosenData', function() {
    beforeEach(function() {
      this.requiredData = {
        kind: 'kind',
        type: 'type',
        column_name: 'colname'
      };
    });

    it('should return an object hash with expected data', function() {
      expect(this.geocodeStuff.geocodingChosenData(this.requiredData)).toEqual({
        table_name: 'table_name',
        kind: 'kind',
        type: 'type',
        column_name: 'colname',
        location: 'world',
        text: true
      });

      expect(this.geocodeStuff.geocodingChosenData({
        type: 'lonlat',
        longitude: 'lon',
        latitude: 'lat'
      })).toEqual({
        table_name: 'table_name',
        type: 'lonlat',
        longitude: 'lon',
        latitude: 'lat',
        location: 'world',
        text: true
      });
    });

    describe('when location is a non-world value', function() {
      it('should return an object that contains the free text location', function() {
        expect(this.geocodeStuff.geocodingChosenData(
            _.extend({}, this.requiredData, { location: 'othercol' })
        , true)).toEqual(jasmine.objectContaining({
          location: 'othercol',
          text: true
        }));
      });
    });
  });
});