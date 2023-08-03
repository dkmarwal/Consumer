import React, { Component } from "react";
import { connect } from "react-redux";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
const defaultPrimary = "#0B1941";
const defaultHighlight = "#008CE6"; //'#8F9EC3';
const defaultBackground = "#F0F6FB";
const theme = createTheme({
  palette: {
    primary: {
      light: "#6094B1",
      secondaryLight: "#8F9EC3",
      main: defaultPrimary,
      // contrastText: "#F0F0F0",
      heading: "#1C4B6B",
      dark: "#162D6E",
    },
    secondary: {
      light: "#f7fafc",
      main: defaultHighlight, //'#008CE6',
      dark: "#20252d",
      // contrastText: "#0B1941",
      active: "#008ce6",
      text: "#FFF",
    },
    success: {
      main: "#6CC551",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
    highlight: {
      main: defaultHighlight,
    },
    background: {
      header: "#FFF",
      active: "#FFF",
      lightGreen: "rgba(51,195,164,0.38)",
      lightBlue: "rgba(204,228,255,0.75)",
      white: "#fff",
      black: "#000",
      main: defaultBackground,
    },
    text: {
      dark: "#2B2D30",
      disabledDark: "#9E9E9E",
      light: "#4C4C4C",
      main: "#0B1941",
      heading: "#008CE6",
      secondary: "#A7A8AA",
      primary: "#333333",
    },
    button: {
      primary: defaultPrimary,
      disabled: "#e0e0e0",
      secondary: "#008CE6",
      main: "#162D6E",
    },
    border: {
      main: "#CCCCCC",
    },
    common: {
      black: "#000000",
      white: "#ffffff",
      main: "#4c4c4c",
      disabled: "#9E9E9E",
      dark: "#2B2D30",
    },
  },
  typography: {
    baseFontSize: 1,
    fontSize: 1,
    htmlFontSize: 1,
    fontFamily: "'Interstate', Arial, Helvetica, sans-serif",
    button: {
      textTransform: "none",
    },
    h1: {
      fontWeight: "normal",
      fontSize: "1.5rem",
    },
    h2: {
      fontWeight: "normal",
      fontSize: "1.125rem",
    },
    h3: {
      fontWeight: "normal",
      fontSize: "1.125rem",
    },
    h4: {
      fontWeight: "normal",
      fontSize: "1rem",
    },
    h5: {
      fontWeight: "normal",
      fontSize: "1rem",
    },
    h6: {
      fontWeight: "normal",
      fontSize: "0.75rem",
    },
    subtitle1: {
      fontWeight: "normal",
      fontSize: "0.813rem",
    },
    subtitle2: {
      fontWeight: "normal",
      fontSize: "0.813rem",
    },
    body1: {
      fontWeight: "normal",
      fontSize: "14px",
    },
    body2: {
      fontWeight: "normal",
      fontSize: "0.875rem",
    },
    caption: {
      fontWeight: "normal",
      fontSize: "0.75rem",
    },
  },
  overrides: {
    MuiButton: {
      contained: {
        borderRadius: "3rem",
        boxShadow: "none",
        border: `1px solid ${defaultPrimary}`,
        "&.MuiButton-containedPrimary:hover": {
          backgroundColor: defaultPrimary,
        },
        '&.MuiButton-contained.Mui-disabled': {
          backgroundColor: '#9E9E9E',
          color: "#ffffff",
          border: "1px solid #9E9E9E"

        },
      },
      outlined: {
        borderRadius: "3rem",
        boxShadow: "none",
        "&.MuiButton-outlinedPrimary,&.MuiButton-outlinedPrimary:hover": {
          border: '1px solid #2B2D30',
          color: "#2B2D30"
        },
        "&.MuiButton-outlined:hover,&.MuiButton-outlined": {
          border: '1px solid #2B2D30',
          color: "#2B2D30"
        },
        '&.MuiButton-outlined.Mui-disabled': {
          border: '1px solid rgba(0, 0, 0, 0.12)',
          color: "rgba(0, 0, 0, 0.26)"
        }
      },
    },
    MuiChip: {
      root: {
        "& $avatarColorPrimary": {
          backgroundColor: defaultHighlight,
        },
      },
    },
    MuiTextField: {
      root: {
        '& .MuiOutlinedInput-colorSecondary.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#2B2D30'
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#2B2D30'
        },
        '& .MuiFormLabel-root.Mui-error': {
          color: '#E02020 !important'
        },
        "& input::-ms-reveal, input::-ms-clear": {
          display: "none"
        }
      }
    }
  },
});

class ThemeWrapperComponent extends Component {
  render() {
    const { user } = this.props;
    const { brandInfo } = user;
    return (
      <MuiThemeProvider
        theme={createTheme({
          palette: {
            ...theme.palette,
            primary: {
              ...theme.palette.primary,
              main: brandInfo?.themeColorPrimary ?? defaultPrimary,
              contrastText: theme.palette.getContrastText(
                brandInfo?.themeColorPrimary ?? defaultPrimary
              ),
            },
            secondary: {
              ...theme.palette.secondary,
              main: brandInfo?.themeColorAccent ?? defaultHighlight,
              contrastText: theme.palette.getContrastText(
                brandInfo?.themeColorAccent ?? defaultHighlight
              ),
            },
            highlight: {
              ...theme.palette.highlight,
              main: brandInfo?.themeColorAccent ?? defaultHighlight,
            },
            background: {
              ...theme.palette.background,
              main: brandInfo?.themeColorBackground ?? defaultBackground,
            },
            // button: {
            //   ...theme.palette.button,
            //   primary: brandInfo?.themeColorPrimary ?? defaultPrimary,
            // },
          },
          typography: {
            ...theme.typography,
          },
          overrides: {
            ...theme.overrides,
            MuiButton: {
              ...theme.overrides.MuiButton,
              contained: {
                ...theme.overrides.MuiButton.contained,
                border: `1px solid ${brandInfo?.themeColorPrimary ?? defaultPrimary}`,
                "&.MuiButton-containedPrimary:hover": {
                  backgroundColor:
                    brandInfo?.themeColorPrimary ?? defaultPrimary,
                },
              },
            },
            MuiChip: {
              ...theme.overrides.MuiChip,
              contained: {
                ...theme.overrides.MuiChip.contained,
                "&.MuiChip-containedPrimary:hover": {
                  backgroundColor:
                    brandInfo?.themeColorAccent ?? defaultHighlight,
                },
              },
            },
          },
        })}
      >
        <div>{this.props.children}</div>
      </MuiThemeProvider>
    );
  }
}

export default ThemeWrapperComponent = withRouter(
  connect((state) => ({
    ...state.user,
  }))(ThemeWrapperComponent)
);
