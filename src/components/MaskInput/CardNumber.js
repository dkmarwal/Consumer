import React, { Component } from "react";
import { Box } from "@material-ui/core";
import TextField from "~/components/Forms/TextField";
import { Tooltip, InputAdornment } from "@material-ui/core";
class CardNumber extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actualField: "",
      maskedField: "",
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
      maskedField: this.starredMask(actual),
    });
    getvalue(actual);
  };
  handleBlur = () => {
    const { actualField } = this.state;
    const { onBlur } = this.props;
    onBlur(actualField);
  };
  starredMask = (ssn) => {
    ssn = ssn && ssn.toString();
    let maskedCharsLength = ssn && ssn.length > 4 ? ssn.length - 4 : 0;
    let str = "";
    str = ssn && "*".repeat(maskedCharsLength) + ssn.slice(maskedCharsLength);
    return str;
  };
  getPaymentIcon = () => {
    const { cardType } = this.props;
    switch (cardType) {
      case "Both":
        return (
          <Box>
            <img
              src={require(`~/assets/icons/master_card.svg`)}
              style={{ padding: "2px" }}
              alt=""
            />
            <img
              src={require(`~/assets/icons/visa.svg`)}
              style={{ padding: "2px" }}
              alt=""
            />
          </Box>
        );
      case "Visa":
        return (
          <Box mr={2}>
            <img
              src={require(`~/assets/icons/visa.svg`)}
              style={{ padding: "2px" }}
              alt=""
            />
          </Box>
        );
      case "MasterCard":
        return (
          <Box mr={2}>
            <img
              src={require(`~/assets/icons/master_card.svg`)}
              style={{ padding: "2px" }}
              alt=""
            />
          </Box>
        );
      default:
        return (
          <Box mr={2}>
            <img
              src={require(`~/assets/icons/visa.svg`)}
              style={{ padding: "2px" }}
              alt=""
            />
            <img
              src={require(`~/assets/icons/master_card.svg`)}
              style={{ padding: "2px" }}
              alt=""
            />
          </Box>
        );
    }
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
      showPaymentIcons,
      cardType,
      onBlur,
      ...restProps
    } = this.props;
    let masked = this.starredMask(value);
    return (
      <div>
        <TextField
          name={name}
          type="text"
          value={masked} //masked from props
          onChange={this.handleChange}
          disabled={disabled}
          autoFocus={autoFocus}
          label={label}
          fullWidth={true}
          inputProps={{ maxLength: maxLength }}
          InputProps={{
            endAdornment: showPaymentIcons ? (
              <InputAdornment position="end">
                {
                  <Tooltip title={""} arrow placement="right">
                    {this.getPaymentIcon()}
                  </Tooltip>
                }
              </InputAdornment>
            ) : null,
          }}
          onBlur={this.handleBlur}
          {...restProps}
        />
      </div>
    );
  }
}

export default CardNumber;
