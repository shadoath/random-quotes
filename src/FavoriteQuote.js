import React, { Component } from "react";
import IconButton from "./IconButton";
import Quote from "./Quote";

import "./styles.scss";

class FavoriteQuote extends Component {
  render() {
    return (
      <div
        className="quote-box favorite-box"
        key={"fb-" + this.props.quoteIndex}
      >
        <Quote
          baseClass="quote"
          quote={this.props.quote}
          author={this.props.author}
        ></Quote>
        <div className="author-favorite" key={"af-" + this.props.quoteIndex}>
          <div className="buttons">
            <IconButton
              faStyle="fad fa-fw"
              faName="fa-trash"
              onClickFunction={() =>
                this.props.removeFavoriteQuote(this.props.quoteIndex)
              }
              data-quoteIndex={this.props.quoteIndex}
            ></IconButton>
            <IconButton
              faStyle="fab fa-fw"
              faName="fa-twitter"
              onClickFunction={() =>
                this.props.shareThisQuote(this.props.quoteIndex)
              }
            ></IconButton>
          </div>
        </div>
      </div>
    );
  }
}

export default FavoriteQuote;
