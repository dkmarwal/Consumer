import { CircularProgress, MenuItem, withStyles } from "@material-ui/core";
import { TextField } from "~/components/Forms";
import { getAllCountries } from "~/redux/actions/csc";
import { connect } from "react-redux";
import { styles } from "./styles";
import React from "react";
import { withTranslation } from "react-i18next";

class Country extends React.Component {
  state = {
    countries: [],
    isLoading: false,
  };

  componentDidMount() {
    this.getCountriesList();
  }

  getCountriesList() {
    this.setState({ isLoading: true }, () => {
      this.props.dispatch(getAllCountries()).then((res) => {
        if (res) {
          const { csc } = this.props;
          this.setState({
            countries: csc && csc["countryList"],
            isLoading: false,
          });
        }
      });
    });
  }

  render() {
    const { selectedCountry, onChange, error, helperText, t, ...restProps } =
      this.props;
    const { countries, isLoading } = this.state;
    return (
      <span>
        <TextField
          select
          fullWidth={true}
          color="secondary"
          autoComplete="off"
          name="country"
          label={t("componentData.CSC.Country")}
          variant="outlined"
          value={selectedCountry}
          onChange={onChange}
          error={error}
          helperText={helperText}
          {...restProps}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            countries &&
            countries
              .filter((country) => country.isoCode !== "CA")
              .map((c) => <MenuItem value={c["isoCode"]}>{c["name"]}</MenuItem>)
          )}
        </TextField>
      </span>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.csc,
  }))(withStyles(styles)(Country))
);
