const expect = require('chai').expect;
const ShebangEnchiladaStore = require('../../lib/stores');

describe('ShebangEnchiladaStore', function() {
  beforeEach(function() {
    // reset the store to initial values
    ShebangEnchiladaStore.setState(ShebangEnchiladaStore.getInitialState());
  });

  it('should have an initial state of {status: \'enabled\'}', function() {
    expect(ShebangEnchiladaStore.state.status).to.be.equal('enabled');
  });

  describe('toggleStatus()', function() {
    it('should switch the state to {status: \'disabled\'}', function() {
      ShebangEnchiladaStore.toggleStatus();
      expect(ShebangEnchiladaStore.state.status).to.be.equal('disabled');
    });

    it('should switch the state back to {status: \'enabled\'} when used a second time', function() {
      ShebangEnchiladaStore.toggleStatus();
      ShebangEnchiladaStore.toggleStatus();
      expect(ShebangEnchiladaStore.state.status).to.be.equal('enabled');
    });
  });
});
