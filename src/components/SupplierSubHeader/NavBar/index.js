import React, { Component, Fragment } from 'react';
import { Tabs, Tab, Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import './styles.scss';
import {accessRights} from '~/config/accessRights';

export default class NavBar extends Component {

    state = {
        leftMenu: this.props.listMenu
    };

    isViewable(name, isProtected) {
        if (isProtected) {
            const { claims } = this.props;
            let isEnabled = claims && claims.includes(accessRights[name]) || false;
            if (isEnabled) {
                return true
            }
            return false;
        } else {
            return true;
        }
    }

    render() {
        const { leftMenu } = this.state;
        const {alias}    = this.props;
        let currentNavIndex = _.findIndex(leftMenu, item => item.alias == alias);
        currentNavIndex = (currentNavIndex == -1) ? 0 : currentNavIndex;

        return (
            <Fragment>
                <div id="navbar">
                    {alias != "none" ? <Tabs 
                        value={currentNavIndex} 
                        textColor="#008CE6"
                        TabIndicatorProps={{
                            style: {
                                backgroundColor: "#008CE6",
                                color: "#008CE6",
                            }
                        }}
                    >
                        {leftMenu.map((navItem, index) => (
                            <span key={index}>
                                {this.isViewable(navItem.alias, navItem.isProtected) === true ?
                                    <Link to={navItem.url} key={index}>
                                        <Tab label={navItem.name} value={currentNavIndex} index={index}  selected={currentNavIndex==index? true: false}/>
                                    </Link> : null}
                            </span>
                        ))}
                    </Tabs>: <Box p={1}> </Box>}
                </div>
            </Fragment>
        )
    }
}
