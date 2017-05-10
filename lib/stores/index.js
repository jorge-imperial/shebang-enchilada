'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Reflux = require('reflux');
var ShebangEnchiladaActions = require('../actions');
var StateMixin = require('reflux-state-mixin');
var Connection = require('mongodb-connection-model');
var DataService = require('mongodb-data-service');

var debug = require('debug')('mongodb-compass:stores:shebang-enchilada');

/**
 * Shebang Enchilada store.
 */
var ShebangEnchiladaStore = Reflux.createStore(_defineProperty({
  /**
   * adds a state to the store, similar to React.Component's state
   * @see https://github.com/yonatanmn/Super-Simple-Flux#reflux-state-mixin
   *
   * If you call `this.setState({...})` this will cause the store to trigger
   * and push down its state as props to connected components.
   */
  mixins: [StateMixin.store],

  /**
   * listen to all actions defined in ../actions/index.jsx
   */
  listenables: ShebangEnchiladaActions,

  /**
   * Initialize everything that is not part of the store's state.
   */
  init: function init() {},


  /**
   * This method is called when all plugins are activated. You can register
   * listeners to other plugins' stores here, e.g.
   *
   * appRegistry.getStore('OtherPlugin.Store').listen(this.otherStoreChanged.bind(this));
   *
   * If this plugin does not depend on other stores, you can delete the method.
   *
   * @param {Object} appRegistry   app registry containing all stores and components
   */
  onActivated: function onActivated(appRegistry) {},


  /**
   * Initialize the Shebang Enchilada store state. The returned object must
   * contain all keys that you might want to modify with this.setState().
   *
   * @return {Object} initial store state.
   */
  getInitialState: function getInitialState() {
    return {
      status: 'initial',
      name: '',
      authenticated: false,
      results: []
    };
  },


  /**
   * This method is called when the data service is finished connecting.
   * If there is an error, the data service is not connected. If not, the
   * passed data service is connected.
   *
   * @param {Object} error          error if connection fails
   * @param {Object} dataService    dataService object if connection succeeds
   */
  onConnected: function onConnected(error, dataService) {
    if (error) {
      return;
    }

    var results = [];
    results = results.concat(this.state.results);
    results = results.concat([dataService.isMongos() ? "mongos" : "not mongos"]);
    debug("royisstupid a1", results);
    // before running the command, set status to "fetching"
    this.setState({
      status: 'fetching',
      results: results
    });
    // run connectionStatus command with showPrivileges to get access to
    // the currently authenticated user(s) if any, and handle result
    /*dataService.command(
      'admin', 
      {connectionStatus: 1, showPrivileges: true},
      this.handleConnectionStatus.bind(this)
      );*/
    dataService.command('admin', { getCmdLineOpts: 1 }, this.handleConnectionStatus.bind(this));
  },
  handleConnectionStatus: function handleConnectionStatus(err, res) {
    debug("royisstupid b", err, res);
    if (err) {
      // handle error state
      this.setState({
        status: 'error'
      });
      return;
    }
    var configdb = "";
    var logpath = "";
    var results = [];
    for (var i = 0; i < res.argv.length; i++) {
      if (res.argv[i] === "--configdb") {
        configdb = res.argv[i + 1];
      } else if (res.argv[i] === "--logpath") {
        logpath = res.argv[i + 1];
      }
    }
    results = results.concat(this.state.results);
    if (logpath !== "") results = results.concat([logpath]);
    if (configdb !== "") results = results.concat([configdb]);
    debug("royisstupid d", results);
    // get the user name of the first authenticated user
    this.setState({
      status: 'complete',
      results: results
    });

    if (configdb !== "") {
      var split = configdb.split("/");
      debug("royisstupid y", split);
      var serversStr = "";
      if (split.length === 1) {
        serversStr = split[0];
      } else {
        serversStr = split[1];
      }
      var servers = serversStr.split(",");
      debug("royisstupid m", servers);
      var server = servers[0].split(":");
      debug("royisstupid z", server[0], server[1]);
      var c = new Connection({
        hostname: server[0],
        port: server[1]
      });
      var dataService = new DataService(c);
      dataService.connect(function () {
        debug("royisstupid n connected");
        dataService.command('admin', { getCmdLineOpts: 1 }, this.handleConnectionStatus.bind(this));
      }.bind(this));
    }
  },


  /**
   * log changes to the store as debug messages.
   * @param  {Object} prevState   previous state.
   */
  storeDidUpdate: function storeDidUpdate(prevState) {
    debug('UserInfo store changed from', prevState, 'to', this.state);
  },


  /**
   * handlers for each action defined in ../actions/index.jsx, for example:
   */
  getResult: function getResult() {
    this.setState({
      status: this.state.status === 'intial' ? 'complete' : 'initial'
    });
  }
}, 'storeDidUpdate', function storeDidUpdate(prevState) {
  debug('ShebangEnchilada store changed from', prevState, 'to', this.state);
}));

module.exports = ShebangEnchiladaStore;