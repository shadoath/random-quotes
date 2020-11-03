import React, { Component } from "react";
import "./styles.scss";

class IconButton extends Component {
  render() {
    const faClass = this.props.faStyle + " " + this.props.faName;
    const buttonClass = "icon-button " + (this.props.isActive ? "active" : "");
    return (
      <div className={buttonClass} onClick={this.props.onClickFunction}>
        <i className={faClass}></i> {this.props.text}
      </div>
    );
  }
}

export default IconButton;
