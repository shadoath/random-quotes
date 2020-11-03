import React, { Component } from "react";

import "./styles.scss";

class Quote extends Component {
  render() {
    return (
      <div className={this.props.baseClass}>
        <h2 className="quote__text">
          <i className="fas fa-quote-left fa-fw fa-xs"></i> {this.props.quote}{" "}
          <i className="fas fa-quote-right fa-fw fa-xs"></i>
        </h2>
        <h3 className="quote__author">~ {this.props.author} ~</h3>
      </div>
    );
  }
}

export default Quote;
