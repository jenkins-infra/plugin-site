import React from 'react';

const NotFound = () =>
  <div className="not-found-box">
    <div className="not-found">
      <i className="icon-plug"/>
      <i className="icon-ban"/>
      <h3>Plugin page not found</h3>
      <p>
        We are sorry but the page you are looking for does not exist.<br />
        <a href="/">Search again</a>?
      </p>
    </div>
  </div>;
export default NotFound;
