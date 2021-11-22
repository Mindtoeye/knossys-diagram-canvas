import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import './css/fontpicker.css';

/**
 *
 */
export default class FontPicker extends Component {

  /**
   *
   */
  constructor(props) {
    super(props);

    // Bind component methods to this context
    this.onWrapperClick = this.onWrapperClick.bind(this);
    this.onOptionClick = this.onOptionClick.bind(this);
    this.onRipple = this.onRipple.bind(this);

    this.state = {
      isOptionsVisible: false,
      selectedFont: this.props.value
    }
  }

  /**
   *
   */
  onWrapperClick() {
    this.setState({isOptionsVisible: !this.state.isOptionsVisible});
  }

  /**
   *
   */
  onOptionClick(e, font) {
    e.stopPropagation();

    if (this.state.isOptionsVisible == false) {
      return;
    }

    if (typeof this.props.onChange == "function") {
      this.props.onChange(font);
    }

    this.setState({isOptionsVisible: false, selectedFont: font});
  }

  /**
   *
   */
  onRipple(e) {
    // Material UI ripple effect
    // e.preventDefault();
    e.stopPropagation();

    let target = e.target;

    var div = document.createElement("div"),
      targetOffset = target.getBoundingClientRect(),
      xPos = e.pageX - targetOffset.left,
      yPos = e.pageY - targetOffset.top;

    div.classList.add('ripple-effect');
    div.style.top = parseInt(yPos - targetOffset.height / 2) + "px";
    div.style.left = parseInt(xPos - targetOffset.height) + "px"

    target.appendChild(div);

    setTimeout(function(){
      target.removeChild(div);
    }, 500);
  }

  /**
   *
   */
	render() {

		const { label, fonts, previews, activeColor } = this.props;

		// Get select font (value) from props or local state if props not given
		const value = this.props.value || this.state.selectedFont;

		return (
			<div className="ReactFontPicker">

				{/* Wrapper */}
				<div className="ReactFontPicker_Wrapper" onClick={this.onWrapperClick}>

					{/* Floating label text */}
					<div className={value === "" ? "ReactFontPicker_Label" : "ReactFontPicker_LabelFloat"}>{label}</div>

					{/* Selected option */}
					<div className="ReactFontPicker_SelectedOption">
						{value}
					</div>

					{/* Downdown button */}
					<div className="ReactFontPicker_Button"></div>

					{/* Options list */}
					<div className={this.state.isOptionsVisible ? "ReactFontPicker_Options" : "ReactFontPicker_OptionsHidden"}>
						{fonts.map((n, i) => {

							var style = {};

							if (value == n)
								style.color = activeColor;

							if (previews)
								style.fontFamily = n;

							return (
								<div className="ReactFontPicker_Option ripple"
										 style={style}
										 key={i}
										 onMouseDown={(e) => this.onRipple(e)}
										 onMouseUp={(e) => this.onOptionClick(e, n)}
										 onClick={(e) => this.onOptionClick(e, n)}
										 >
									{n}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

FontPicker.propTypes = {
	fonts: PropTypes.array,
	label: PropTypes.string,
	previews: PropTypes.bool,
	activeColor: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func,
}

FontPicker.defaultProps = {
	label: "",
	previews: true,
	fonts: [
		"Arial",
		"Arial Narrow",
		"Arial Black",
		"Courier New",
		"Georgia",
		"Lucida Console",
		"Lucida Sans Unicode",
		"Tahoma",
		"Times New Roman",
		"Verdana"
	],
	activeColor: "#64B5F6",
	value: "",
	onChange: function(font) {
		console.log("FontPicker: " + font);
	}
}

