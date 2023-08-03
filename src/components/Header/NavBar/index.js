import React, { Component, Fragment } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {withTranslation} from 'react-i18next'

class NavBar extends Component {

    state = {
        leftMenu: [
            {
                "url": "/redeem",
                "name": "Redeem",
                "items": []
            },
            {
                "url": "/payments",
                "name": "Rewards",
                "items": []
            },
            {
                "url": "/manage-account",
                "name": "Manage Account",
                "items": []
            },
            {
                "url": "/support",
                "name": "Support",
                "items": []
            },
            {
                "url": "/bankers",
                "name": "Employee Rewards",
                "items": []
            }
        ]
    };

    showLink(navItem) {
        return true;
    }

    render() {
        const { leftMenu } = this.state
        const { path } = this.props.match
        const currentNavIndex = _.findIndex(leftMenu, item => item.url === path)
        const { isLoggedIn, t } = this.props;

        return (
            <Fragment>
                <div id="navbar">
                    {isLoggedIn ? <Tabs value={currentNavIndex} indicatorColor={`primary`}>
                        {leftMenu.map((navItem, index) => (
                            this.showLink(navItem) &&
                            <div>
                                <Link to={navItem.url} key={index}>
                                    <Tab label={t(`header.label.${navItem.name}`)} />
                                </Link>
                            </div>
                        ))}
                    </Tabs> : null}
                </div>
            </Fragment>
        )
    }
}
export default withTranslation('common')(NavBar)
