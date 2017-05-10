'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var PropTypes = require('prop-types');
var ShebangEnchiladaActions = require('../actions');
var ToggleButton = require('./toggle-button');
var ResultComponent = require('./result');

// const debug = require('debug')('mongodb-compass:shebang-enchilada');

var ShebangEnchiladaComponent = function (_React$Component) {
  _inherits(ShebangEnchiladaComponent, _React$Component);

  function ShebangEnchiladaComponent() {
    _classCallCheck(this, ShebangEnchiladaComponent);

    return _possibleConstructorReturn(this, (ShebangEnchiladaComponent.__proto__ || Object.getPrototypeOf(ShebangEnchiladaComponent)).apply(this, arguments));
  }

  _createClass(ShebangEnchiladaComponent, [{
    key: 'onClick',
    value: function onClick() {
      ShebangEnchiladaActions.getResult();
    }

    /**
     * Render ShebangEnchilada component.
     *
     * @returns {React.Component} The rendered component.
     */

  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'shebang-enchilada' },
        React.createElement(
          'h2',
          { className: 'shebang-enchilada-title' },
          'ShebangEnchiladaComponent'
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'i',
            null,
            'Gets everything you need to fix your database'
          )
        ),
        React.createElement(
          'p',
          null,
          'The current status is: ',
          React.createElement(
            'code',
            null,
            this.props.status
          )
        ),
        React.createElement(ToggleButton, { onClick: this.onClick }),
        React.createElement(ResultComponent, this.props)
      );
    }
  }]);

  return ShebangEnchiladaComponent;
}(React.Component);

ShebangEnchiladaComponent.propTypes = {
  status: PropTypes.oneOf(['initial', 'fetching', 'complete', 'error'])
  //, results: PropTypes.array
};

ShebangEnchiladaComponent.defaultProps = {
  status: 'initial'
};

ShebangEnchiladaComponent.displayName = 'ShebangEnchiladaComponent';

module.exports = ShebangEnchiladaComponent;