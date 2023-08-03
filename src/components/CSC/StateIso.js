import {
  CircularProgress,
  MenuItem,
  withStyles,
  TextField,
} from '@material-ui/core';
import { getStatesOfCountry } from '~/redux/actions/csc';
import { connect } from 'react-redux';
import { styles } from './styles';
import React from 'react';
import clsx from 'clsx'

export class StatesIso extends React.Component {
  state = {
    states: [],
    isLoading: false,
  };

  componentDidMount() {
    const { selectedCountry } = this.props;
    if (selectedCountry !== '') {
      const { selectedCountry } = this.props;
      this.getStatesList(selectedCountry);
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedCountry } = this.props;
    if (prevProps['selectedCountry'] !== this.props['selectedCountry']) {
      this.getStatesList(selectedCountry);
    }
  }

  getStatesList(selectedCountry) {
    this.setState({ isLoading: true }, () => {
      this.props.dispatch(getStatesOfCountry(selectedCountry)).then((res) => {
        if (res) {
          const { csc } = this.props;
          this.setState({ states: csc && csc['stateList'], isLoading: false });
        }
      });
    });
  }

  render() {
    const { states, isLoading } = this.state;
    const {
      selectedCountry,
      onChange,
      selectedState,
      error,
      helperText,
      label,
      name,
      required,
      disabled,
      inputProps,
      classes,
      className
    } = this.props;

    return (
      <span>
        <TextField
          select
          fullWidth={true}
          color="secondary"
          autoComplete="off"
          name={name}
          label={label}
          variant="outlined"
          value={selectedState}
          onChange={onChange}
          error={error}
          helperText={helperText}
          SelectProps={{
            MenuProps: { className: classes.selectDropDown },
          }}
          className={clsx(className,classes.textFieldStyle)}
          // InputLabelProps={{
          //   shrink: InputLabelProps && InputLabelProps.shrink || false,
          // }}
          required={required || false}
          disabled={disabled || false}
          inputProps={{ readOnly: inputProps && inputProps.readOnly ? true : false }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            selectedCountry &&
            states &&
            states.map((s, index) => (
              <MenuItem key={`${s['name']}_${index}`} value={s['stateCode']}>
                {s['name']}
              </MenuItem>
            ))
          )}
        </TextField>
      </span>
    );
  }
}

export default connect((state) => ({
  ...state.csc,
}))(withStyles(styles)(StatesIso));
