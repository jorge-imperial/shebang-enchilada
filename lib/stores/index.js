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
      results: [],
      servers: [],
      dataService: null
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
    this.setState({ dataService: dataService });
    dataService.find("config.shards", {}, {}, this.handleShards.bind(this));
  },
  handleShards: function handleShards(err, docs) {
    debug("handleShards", err, docs);
    if (err) {
      // handle error state
      this.setState({
        status: 'error'
      });
      return;
    }
    var serverList = [];
    for (var i = 0; i < docs.length; i++) {
      var split = docs[i].host.split("/");
      var serversStr = "";
      if (split.length === 1) {
        serversStr = split[0];
      } else {
        serversStr = split[1];
      }
      var servers = serversStr.split(",");
      serverList = serverList.concat(servers);
    }
    this.setState({ servers: serverList });
    this.state.dataService.find('config.chunks', {}, {}, this.handleChunks.bind(this));
  },
  handleChunks: function handleChunks(err, docs) {
    debug("handleChunks", err, docs);
    if (err) {
      // handle error state
      this.setState({
        status: 'error'
      });
      return;
    }
    var results = [];
    results = results.concat(this.state.results);
    results.push("-- chunks --");
    for (var i = 0; i < docs.length; i++) {
      var chunk = docs[i];
      // { "_id" : { "$minKey" : 1 } } -->> { "_id" : NumberLong("-4611686018427387902") } on : shard01 Timestamp(2, 2)
      debug("handleChunks chunk", chunk.min._id, chunk.max._id);
      results.push((chunk.min._id._bsontype && chunk.min._id._bsontype === 'MinKey' ? '$minKey' : chunk.min._id) + " -->> " + (chunk.min._id._bsontype && chunk.max._id._bsontype === 'MaxKey' ? '$maxKey' : chunk.max._id) + " on : " + chunk.shard + " " + chunk.lastmod + " " + (chunk.jumbo ? "jumbo " : ""));
    }
    this.setState({
      results: results
    });
    this.state.dataService.command('admin', { getCmdLineOpts: 1 }, this.handleGetCmdLineOpts.bind(this));
  },
  handleGetCmdLineOpts: function handleGetCmdLineOpts(err, res) {
    debug("handleGetCmdLineOpts", err, res);
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
    if (logpath !== "") {
      results.push("-- logpath --");
      results.push(logpath);
    }
    if (configdb !== "") {
      results.push("-- config servers --");
      results.push(configdb);
    }

    if (configdb !== "") {
      var split = configdb.split("/");
      var serversStr = "";
      if (split.length === 1) {
        serversStr = split[0];
      } else {
        serversStr = split[1];
      }
      var servers = serversStr.split(",");
      var server = servers[0].split(":");
      this.setState({
        status: 'complete',
        results: results
      });
      var c = new Connection({
        hostname: server[0],
        port: server[1]
      });
      var dataService = new DataService(c);
      this.setState({ dataService: dataService });
      dataService.connect(function () {
        debug("dataService connected");
        dataService.command('admin', { getCmdLineOpts: 1 }, this.handleGetCmdLineOpts.bind(this));
      }.bind(this));
    } else if (this.state.dataService != null) {
      this.setState({
        status: 'complete',
        results: results
      });
      this.state.dataService.command('admin', { replSetGetStatus: 1 }, this.handleReplSetGetStatus.bind(this));
    }
  },
  handleReplSetGetStatus: function handleReplSetGetStatus(err, res) {
    debug("handleReplSetGetStatus", err, res);
    if (err) {
      // handle error state
      this.setState({
        status: 'error'
      });
      return;
    }
    var results = [];
    results = results.concat(this.state.results);
    results.push("-- rs.status() --");
    for (var i = 0; i < res.members.length; i++) {
      results.push(res.members[i].name + ", " + res.members[i].stateStr);
    }

    if (this.state.servers !== null && this.state.servers.length > 0) {
      var serverList = [];
      serverList = serverList.concat(this.state.servers);
      var serverStr = serverList.shift();
      var server = serverStr.split(":");
      debug("Connecting to", server[0], server[1]);
      var c = new Connection({
        hostname: server[0],
        port: server[1]
      });
      var dataService = new DataService(c);
      this.setState({ dataService: dataService, servers: serverList });
      dataService.connect(function () {
        debug("dataService connected");
        dataService.command('admin', { getCmdLineOpts: 1 }, this.handleGetCmdLineOpts.bind(this));
      }.bind(this));
    }

    // get the user name of the first authenticated user
    this.setState({
      status: 'complete',
      results: results
    });
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