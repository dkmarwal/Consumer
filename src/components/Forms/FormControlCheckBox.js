import React from 'react';
import { FormControlLabel, Checkbox, makeStyles } from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

const formControlStyle = makeStyles((theme) => ({
    root: {
        paddingLeft:'10px'
    },
    label: {
        textAlign: 'left',
        // fontSize: '.9rem',
        marginRight: '10px',
        color: 'rgba(0,0,0,0.87)',
        fontFamily: theme.typography.fontFamily,
        fontSize: '16px',
        letterSpacing: 0,
        lineHeight: '16px',
    }
}));

const FormControlCheckBox = ({ name, id, label, checked, onChange, ...restProps }) => {

    const FormControlClasses = formControlStyle();

    return (
        <FormControlLabel
            key={id}
            id={id}
            classes={FormControlClasses}
            control={
                <Checkbox
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    icon={<CheckBoxOutlineBlankIcon fontSize="small" style={{ color: 'rgba(0,0,0,0.6)' }} />}
                    checkedIcon={<CheckBoxIcon fontSize="small" style={{ color: 'rgba(0,0,0,0.6)' }} />}
                    {...restProps}
                />
            }
            label={label}
        />
    );
};

export default FormControlCheckBox;
