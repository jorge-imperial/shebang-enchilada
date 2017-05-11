const React = require('react');
const PropTypes = require('prop-types');
const ShebangEnchiladaActions = require('../actions');
const ToggleButton = require('./toggle-button');
const CatPicture = require('./cat-picture');
const ResultComponent = require('./result');

// const debug = require('debug')('mongodb-compass:shebang-enchilada');

class ShebangEnchiladaComponent extends React.Component {

  onClick() {
    ShebangEnchiladaActions.getResult();
  }

  /**
   * Render ShebangEnchilada component.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    return (
      <div className="shebang-enchilada">
        <h2 className="shebang-enchilada-title">ShebangEnchiladaComponent</h2>
        <p><i>Gets everything you need to fix your database</i></p>
        <p>The current status is: <code>{this.props.status}</code></p>
        <ResultComponent {...this.props} />
        <CatPicture />
      </div>
    );
  }
}

ShebangEnchiladaComponent.propTypes = {
  status: PropTypes.oneOf(['initial', 'fetching', 'complete', 'error'])
  //, results: PropTypes.array
};

ShebangEnchiladaComponent.defaultProps = {
  status: 'initial'
};

ShebangEnchiladaComponent.displayName = 'ShebangEnchiladaComponent';

module.exports = ShebangEnchiladaComponent;
