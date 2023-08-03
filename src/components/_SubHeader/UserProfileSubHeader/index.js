import React, { Component } from 'react';
import { Typography, Box, Card, Grid } from '@material-ui/core';
import { Tabs, Tab } from '@material-ui/core';
import { TabPanel } from '~/components/TabPanel/index';
import '../styles.scss';

const styles = (theme) => ({
  root: {
    marginBottom: 0,
    padding: '0px 40px',
    marginTop: '5px',
  },
  headingTop: {
    fontWeight: 400,
    margin: '5px 0px',
    padding: '35px 0px',
    fontSize: '34px',
    textTransform: 'capitalize !important',
    color:'#2B2D30'
  },
  logoWrap: {
    padding: '0.70rem 1.875rem',
    fontSize: '16px',
    color: '#051b2',
  },
  headerBottom: {
    width: 'auto',
    padding: '5px',
    fontSize: '14px',
    borderBottom: '0px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  tabItem:{
      '& .MuiTab-root':{
          padding:0,
          display:'flex',
          alignItems:'flex-end'
      }
  }
});

class UserProfileSubHeader extends Component {
  state = {
    selectedTab: 0,
  };

  handleTabChange = (index) => {
    this.setState({ selectedTab: index });
  };

  render() {
    const { title } = this.props;
    const { tabs } = this.props;
    const { selectedTab } = this.state;
    const classes = styles();

    return (
      <Box display="flex" flexDirection="column" width="100%" bgcolor="background.main">
        <Card square className="activeTabsColor">
          <Grid container direction="column" style={{paddingLeft: '90px', paddingTop: '10px' }}>
            <Grid item>
              <Typography
                variant="h1"
                className={classes.headingTop}
              >
                {title}
              </Typography>
            </Grid>
            <Grid item>
              <Tabs
                value={selectedTab}
                TabIndicatorProps={{
                  style: {
                    backgroundColor: '#008ce6 ',
                    color: '#008ce6 ',
                  },
                }}
              >
                {tabs.map((tab, index) => (
                  <span>
                    {tab.showTab ? (
                      <Tab
                        onClick={() => this.handleTabChange(index)}
                        label={tab.name}
                        disabled={false}
                        index={index}
                        selected={selectedTab === index}
                        className={classes.tabItem}
                      />
                    ):null}
                  </span>
                ))}
              </Tabs>
            </Grid>
          </Grid>
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

export default UserProfileSubHeader
