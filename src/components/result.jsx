const React = require('react');
const PropTypes = require('prop-types');
const FontAwesome = require('react-fontawesome');

const debug = require('debug')('mongodb-compass:user-info');
class ResultComponent extends React.Component {

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
  render() {
    const { authenticated, name, status, results } = this.props;
    debug( "royisstupid c", results );
    return (
      <div className="results-box">
      <div className="user-info">
        <FontAwesome name="user-circle-o" />
        <span className="user-info-name"> {status}</span>
      </div>

      <ul className="results">
        {
          results.map(function(value,index) {
            return <li key={index}>{value}</li>
          })
        }
      </ul>
      </div>

    );
  }
}

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
