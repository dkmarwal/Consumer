import React from 'react';
import { Grid, Box, Typography } from '@material-ui/core';
import { styles } from './styles';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

const NoPageFound = (props) => {
    const { classes, t } = props;
    return (
        <Grid container justifyContent="center" alignItems="center" className={classes.root} >
            <Grid item xs={12} md={12} lg={12} xl={12}>
                <Box display="flex" flexDirection="column" justifyContent="center" bgcolor="white" className={classes.paymentRegCont} >
                    <Typography variant="h1" align="center" className={classes.paymentHeading}>
                        {t("noPageFound.error404")}
                    </Typography>
                    <Box display="flex" p={4} justifyContent="center" className={classes.NoPageBg}>
                       
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Box className={classes.pageNotFoundTxt}>
                        {t("noPageFound.pageNotFound")}
                        </Box>
                    </Box>
                </Box>

            </Grid>
        </Grid>
    );
};

export default withTranslation()(
    connect((state) => ({
        ...state.paymentRegistration,
    }))(withStyles(styles)(NoPageFound))
);
