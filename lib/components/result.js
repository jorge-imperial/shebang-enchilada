'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var PropTypes = require('prop-types');
var FontAwesome = require('react-fontawesome');

var debug = require('debug')('mongodb-compass:user-info');

var ResultComponent = function (_React$Component) {
  _inherits(ResultComponent, _React$Component);

  function ResultComponent() {
    _classCallCheck(this, ResultComponent);

    return _possibleConstructorReturn(this, (ResultComponent.__proto__ || Object.getPrototypeOf(ResultComponent)).apply(this, arguments));
  }

  _createClass(ResultComponent, [{
    key: 'render',


    /**
     * constructor
     * 
     */
    /*constructor(props) {
      super()
      this.props.authenticated = props.authenticated;
      this.props.status = props.status;
      this.props.name = props.name;
    }*/

    /**
     * Render ResultComponent.
     *
     * This component shows the user name as a header item in Compass
     * if authenticated to a mongodb.
     *
     * @returns {React.Component} The rendered component.
     */
    value: function render() {
      var _props = this.props,
          authenticated = _props.authenticated,
          name = _props.name,
          status = _props.status,
          results = _props.results;

      debug("royisstupid c", results);
      return React.createElement(
        'div',
        { className: 'results-box' },
        React.createElement(
          'div',
          { className: 'user-info' },
          React.createElement(FontAwesome, { name: 'user-circle-o' }),
          React.createElement(
            'span',
            { className: 'user-info-name' },
            ' ',
            status
          )
        ),
        React.createElement(
          'ul',
          { className: 'results' },
          results.map(function (value, index) {
            return React.createElement(
              'li',
              { key: index },
              value
            );
          })
        )
      );
    }
  }]);

  return ResultComponent;
}(React.Component);

ResultComponent.propTypes = {
  status: PropTypes.oneOf(['initial', 'fetching', 'complete', 'error']),
  authenticated: PropTypes.bool,
  name: PropTypes.string
  //, results: PropTypes.array
};

ResultComponent.defaultProps = {
  status: 'initial',
  authenticated: false,
  name: ''
};

ResultComponent.displayName = 'ResultComponent';

module.exports = ResultComponent;