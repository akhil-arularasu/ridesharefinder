import React, { Component } from 'react';

class VerticalAd extends Component {
  componentDidMount() {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  render() {
    return (
      <div className="ad">
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-8377403251757371"
          data-ad-slot="2983852334"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      </div>
    );
  }
}

export default VerticalAd;
