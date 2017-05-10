const ShebangEnchiladaComponent = require('./lib/components');
const ShebangEnchiladaActions = require('./lib/actions');
const ShebangEnchiladaStore = require('./lib/stores');

/**
 * A sample role for the component.
 */
const ROLE = {
  name: 'ShebangEnchilada',
  component: ShebangEnchiladaComponent
};

/**
 * Activate all the components in the Shebang Enchilada package.
 */
function activate() {
  // Register the ShebangEnchiladaComponent as a role in Compass
  //
  // Available roles are:
  //   - Instance.Tab
  //   - Database.Tab
  //   - Collection.Tab
  //   - CollectionHUD.Item
  //   - Header.Item

  global.hadronApp.appRegistry.registerRole('Instance.Tab', ROLE);
  global.hadronApp.appRegistry.registerAction('ShebangEnchilada.Actions', ShebangEnchiladaActions);
  global.hadronApp.appRegistry.registerStore('ShebangEnchilada.Store', ShebangEnchiladaStore);
}

/**
 * Deactivate all the components in the Shebang Enchilada package.
 */
function deactivate() {
  global.hadronApp.appRegistry.deregisterRole('Instance.Tab', ROLE);
  global.hadronApp.appRegistry.deregisterAction('ShebangEnchilada.Actions');
  global.hadronApp.appRegistry.deregisterStore('ShebangEnchilada.Store');
}

module.exports = ShebangEnchiladaComponent;
module.exports.activate = activate;
module.exports.deactivate = deactivate;
