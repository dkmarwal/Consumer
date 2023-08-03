import React, { Component } from "react";
import {
  Typography,
  Box,
  Card,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Tabs, Tab } from "@material-ui/core";
import { TabPanel } from "~/components/TabPanel/index";
import "./styles.scss";
import GlobalStyled from "~/globalStyled.js";

const styles = (theme) => ({
  root: {
    marginBottom: 0,
    padding: "0px 40px",
    marginTop: "5px",
  },
  headingTop: {
    fontWeight: 400,
    margin: "5px 0px",
    padding: "30px 0px",
    fontSize: "34px",
  },
  logoWrap: {
    padding: "0.70rem 1.875rem",
    fontSize: "16px",
    color: "#051b2",
  },
  headerBottom: {
    width: "auto",
    padding: "5px",
    fontSize: "14px",
    borderBottom: "0px",
    fontWeight: "600",
    marginBottom: "10px",
  },
});

class CampaignSubHeader extends Component {
  state = {
    selectedTab: 0,
  };

  isViewable(name, isProtected) {
    return true;
    // if (isProtected) {
    //   const { claims } = this.props;
    //   let str = `${name && name.toLowerCase()}_view`;
    //   let isEnabled = claims && claims.includes(str);
    //   if (isEnabled) {
    //     return true;
    //   }
    //   return false;
    // } else {
    //   return true;
    // }
  }

  handleTabChange = (index) => {
    this.setState({ selectedTab: index });
  };

  render() {
    const { classes, title } = this.props;
    const { tabs } = this.props;
    const { selectedTab } = this.state;

    return (
      <Box>
        <Card square>
          <Box px={5}>
            <Box>
              <Typography
                color="primary"
                variant="h2"
                className={classes.headingTop}
              >
                {title}
              </Typography>
            </Box>
            <Tabs
              value={selectedTab}
              textColor="secondary"
              indicatorColor="secondary"
            >
              {tabs.map((tab, index) => (
                <span>
                  {tab.showTab && (
                    <Tab
                      onClick={() => this.handleTabChange(index)}
                      label={tab.name}
                      disabled={false}
                      index={index}
                      selected={selectedTab === index}
                    />
                  )}
                </span>
              ))}
            </Tabs>
          </Box>
        </Card>
        {tabs.map((obj, i) => (
          <div>
            {selectedTab === i && obj.showTab && (
              <TabPanel value={selectedTab} index={i}>
                {obj.component}
              </TabPanel>
            )}
          </div>
        ))}
      </Box>
    );
  }
}

export default withStyles(GlobalStyled)(CampaignSubHeader);
