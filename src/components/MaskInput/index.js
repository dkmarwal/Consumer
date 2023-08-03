import React, { Component } from "react";
import TextField from "~/components/Forms/TextField";
import { InputAdornment } from "@material-ui/core";
import { starredMask } from "~/utils/common";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

class MaskInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actualField: "",
      maskedField: "",
      showDecryptedValue: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { value } = this.props;
    const prevValue = "";
    const newValue = "";
    let actual = value || "";
    this.mask(prevValue, newValue, actual);
  }

  handleChange(event) {
    const { maskedField, actualField } = this.state;
    const prevValue = maskedField;
    const origValue = event.target.value || "";
    const newValue = origValue.split(" ").join("");
    let actual = actualField;
    this.mask(prevValue, newValue, actual);
  }

  mask = (prevValue, newValue, actual) => {
    const { getvalue } = this.props;
    if (newValue.length > prevValue.length) {
      let newChar = newValue.split("").pop();
      if (!isNaN(newChar)) actual = `${actual}${newChar}`;
    }
    // backspacing / deleting
    else {
      const charsRemovedCount = prevValue.length - newValue.length;
      if (newValue.length === 1) {
        actual = newValue;
      } else {
        actual =
          (actual &&
            actual.toString().substr(0, actual.length - charsRemovedCount)) ||
          "";
      }
    }
    this.setState({
      actualField: actual,
      maskedField: starredMask(actual),
    });
    getvalue(actual);
  };

  render() {
    const {
      disabled,
      maxLength,
      name,
      value,
      autoFocus,
      label,
      getvalue,
      minLength = 0,
      ...restProps
    } = this.props;
    let masked = starredMask(value);
    return (
      <div>
        <div>
          <TextField
            name={name}
            type="text"
            value={this.state.showDecryptedValue ? value : masked} //masked from props
            onChange={this.handleChange}
            disabled={disabled}
            autoFocus={autoFocus}
            label={label}
            fullWidth={true}
            inputProps={{ maxLength: maxLength, minLength }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {this.state.showDecryptedValue ? (
                    <VisibilityIcon
                      onClick={() =>
                        this.setState({
                          showDecryptedValue: false,
                        })
                      }
                      fontSize="small"
                      style={{
                        color: "#4c4c4c",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <VisibilityOffIcon
                      onClick={() =>
                        this.setState({
                          showDecryptedValue: true,
                        })
                      }
                      fontSize="small"
                      style={{
                        color: "#4c4c4c",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </InputAdornment>
              ),
            }}
            {...restProps}
          />
        </div>
      </div>
    );
  }
}

export default MaskInput;
