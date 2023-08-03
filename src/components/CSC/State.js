import { CircularProgress, MenuItem, withStyles } from "@material-ui/core";
import { TextField } from "~/components/Forms";
import { getStatesOfCountry } from "~/redux/actions/csc";
import { connect } from "react-redux";
import { styles } from "./styles";
import React from "react";

export class States extends React.Component {
    state = {
        states: [],
        isLoading: false,
    }

    componentDidMount() {
        const { selectedCountry } = this.props;
        if (selectedCountry != "") {
            const { selectedCountry } = this.props;
            this.getStatesList(selectedCountry);
        }
    }

    componentDidUpdate(prevProps) {
        const { selectedCountry } = this.props;
        if (prevProps["selectedCountry"] !== this.props["selectedCountry"]) {
            this.getStatesList(selectedCountry);
        }
    }

    getStatesList(selectedCountry) {
        this.setState({ isLoading: true }, () => {
            this.props.dispatch(getStatesOfCountry(selectedCountry)).then(res => {
                if (res) {
                    const { csc } = this.props;
                    this.setState({ states: csc && csc["stateList"], isLoading: false })
                }
            })
        })
    }

    render() {
        const { states, isLoading } = this.state;
        const { selectedCountry, onChange, selectedState, error, helperText, label,classes } = this.props;
        return (
            <span>
                <TextField
                    select
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    name="state"
                    label={label}
                    variant="outlined"
                    value={selectedState || ""}
                    onChange={onChange}
                    error={error}
                    helperText={helperText}
                    SelectProps={{
                        MenuProps: { className: classes.selectDropDown },
                      }}
                >
                    {isLoading ? <CircularProgress /> : selectedCountry && states && states.length > 0 ?  states.map(s => <MenuItem key={s["name"]} value={s["name"]}>{s["name"]}</MenuItem>) : <MenuItem key={0} value={""}></MenuItem>}
                </TextField>
            </span>
        )
    }
}

export default connect((state) => ({
    ...state.csc,
}))(withStyles(styles)(States))
