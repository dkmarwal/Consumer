import React from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import TextField from '~/components/Forms/TextField';

const NumberFormatCustom = (props) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        const { value } = values;
        onChange({
          target: {
            name: props.name,
            value: value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$ "
      decimalSeparator="."
      allowNegative={false}
      decimalScale={2}
      isAllowed={(values) => {
        const { value } = values;
        if (value && parseInt(value).toString().length > 15) {
          return false;
        }
        return true;
      }}
    />
  );
};

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

class CurrencyInput extends React.Component {
  render() {
    const { label, value, name, onChange, formatterProps, ...restProps } =
      this.props;

    return (
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        name={name}
        InputProps={{
          inputComponent: NumberFormatCustom,
          inputProps: formatterProps,
          readOnly:
            restProps.inputProps && restProps.inputProps.readOnly
              ? true
              : false,
        }}
        {...restProps}
      />
    );
  }
}

CurrencyInput.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  formatterProps: PropTypes.object.isRequired,
};
export default CurrencyInput;
