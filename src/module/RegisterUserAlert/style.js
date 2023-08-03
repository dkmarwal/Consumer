const styles = (theme) => ({
    root: {
      marginBottom: '24px', 
      minHeight: 'calc(100vh - 80px)',
    },

    mainBox:{
      background: '#fff',     
      width: "60vw",
      margin:'auto',
      boxShadow:'0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12), 0px 1px 5px rgba(0, 0, 0, 0.2)',
      textAlign: 'center',
      padding: 30,
      boxSizing: "border-box",
      [theme.breakpoints.down("md")]: {
        width: "86vw",
      },
    },

    logoBox:{      
      display: "block",
      margin: "0 auto 10px",     
      "& img":{
        margin: 0,
        padding: 0,
        maxWidth: 200,
        maxHeight: 140,        
      }
    },    

    topHeading:{
      color: '#0B1941',
      fontSize: '30px',
      fontWeight: '600',
      margin: '15px 0 20px',
      padding: 0,
    },
    mainBoxCol: {
      paddingTop: '80px',
    },

    midProfileImg:{
      display: "block",
      margin: "0 auto 20px",
      maxWidth: 200,
      maxHeight: 210,
    },

    exchangeTxt:{
      color: "#4C4C4C",
      fontSize: 20,
      margin: '0 0 10px',
      padding: 0,
    },

    clickHereTxt:{
      color: "#4C4C4C",
      fontSize: 20,
      "& span":{
        color: "#008CE6",
        textDecoration: "underline",
        fontSize: 20,
        cursor: "pointer"
      }
    }

});

export default styles;
