import React, { Component, Fragment } from 'react';
import './styles.scss';

export default class NavBar extends Component {

    state = {
        selectedTab: 0
    };

    isViewable(name, isProtected) {
        return true;
        if (isProtected) {
            const { claims } = this.props;
            let str = `${name && name.toLowerCase()}_view`;
            let isEnabled = claims && claims.includes(str);
            if (isEnabled) {
                return true
            }
            return false;
        } else {
            return true;
        }
    }

    handleTabChange = (index) => {
        this.setState({ selectedTab: index })
    }

    render() {

        return (
            <Fragment>
              
            </Fragment>
        )
    }
}