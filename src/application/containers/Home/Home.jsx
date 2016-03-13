import React, { Component } from 'react';
import Helmet from 'react-helmet';

import './Home.scss';

export default class Home extends Component {
  render() {
    return (
      <div className="home">
        <Helmet title="Home"/>
        <div className="masthead">
          <div className="container">
            <h1>imgherd homepage</h1>
          </div>
        </div>

        <div className="container">
        </div>
      </div>
    );
  }
}
