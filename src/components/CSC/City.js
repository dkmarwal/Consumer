import { CircularProgress, MenuItem, withStyles } from "@material-ui/core";
import { TextField } from "~/components/Forms";
import { getCitiesOfState } from "~/redux/actions/csc";
import { connect } from "react-redux";
import { styles } from "./styles";
import React from "react";
import { withTranslation } from 'react-i18next';

export class City extends React.Component {
    state = {
        cities: [],
        isLoading: false
    }
    componentDidMount() {
        const { selectedState } = this.props;
        if (selectedState !== "") {
            this.getCitiesList(selectedState);
        }
    }
    componentDidUpdate(prevProps) {
        //This is called when state field is changed. and REST API is called.
        const { selectedState } = this.props;
        if (prevProps["selectedState"] !== this.props["selectedState"] && selectedState !=="") {
            this.getCitiesList(selectedState)
        }

        //This is called when country field is changed. and clear the city field.
        if (prevProps["selectedCountry"] !== this.props["selectedCountry"]) {
            this.setState({ cities: [] });
        }
    }

    getCitiesList(selectedState) {
        this.setState({ isLoading: true }, () => {
            this.props.dispatch(getCitiesOfState(selectedState)).then(res => {
                if (res) {
                    const { csc } = this.props;
                    this.setState({ cities: csc && csc["cityList"], isLoading: false })
                }
            })
        })
    }


    render() {
        const { selectedState, selectedCity, onChange, error, helperText, t, label,classes} = this.props;
        const { cities, isLoading } = this.state;
        return (
            <span>
                <TextField
                    select
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    name="city"
                    label= { label || t('componentData.CSC.City')}
                    variant="outlined"
                    value={selectedCity || ""}
                    onChange={onChange}
                    error={error}
                    helperText={helperText}
                    SelectProps={{
                        MenuProps: { className: classes.selectDropDown },
                      }}
                >
                    {isLoading ? <CircularProgress /> : selectedState && cities && cities.length > 0 ?cities.map(s => <MenuItem key={s["name"]} value={s["name"]}>{s["name"]}</MenuItem>) : <MenuItem key={0} value={""}></MenuItem>}
                </TextField>
            </span>
        )
    }
}

export default withTranslation()(connect((state) => ({
    ...state.csc,
}))(withStyles(styles)(City)))
