const React = require('react');
const { StoreConnector } = require('hadron-react-components');
const ShebangEnchiladaComponent = require('./shebang-enchilada');
const Store = require('../stores');
const Actions = require('../actions');

// const debug = require('debug')('mongodb-compass:shebang-enchilada:index');

class ConnectedShebangEnchiladaComponent extends React.Component {
  /**
   * Connect ShebangEnchiladaComponent to store and render.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    return (
      <StoreConnector store={Store}>
        <ShebangEnchiladaComponent actions={Actions} {...this.props} />
      </StoreConnector>
    );
  }
}

ConnectedShebangEnchiladaComponent.displayName = 'ConnectedShebangEnchiladaComponent';

module.exports = ConnectedShebangEnchiladaComponent;
