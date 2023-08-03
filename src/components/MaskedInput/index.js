import React from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import TextField from "~/components/Forms/TextField";

const NumberFormatCustom = (props) => {

    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
        />
    );
}

NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

class MaskedInput extends React.Component {
    render() {
        const { label, value, name, onChange, formatterProps, ...restProps } = this.props;
        return <TextField
            label={label}
            value={value}
            onChange={onChange}
            name={name}
            InputProps={{
                inputComponent: NumberFormatCustom,
                inputProps: formatterProps
            }}
            {...restProps}
        />
    }
}


MaskedInput.propTypes = {
    inputRef: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    formatterProps: PropTypes.object.isRequired
};
export default MaskedInput;
