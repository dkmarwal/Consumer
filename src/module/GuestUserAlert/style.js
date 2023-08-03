const styles = (theme) => ({
    root: {
      marginBottom: '24px',   
      minHeight: 'calc(100vh - 80px)',      
      position: 'relative',
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
    mainBoxCol: {
      paddingTop: '80px',      
    },

    logoBox:{      
      display: "block",
      margin: "0 auto 20px",     
      "& img":{        
        maxWidth: 200,
        maxHeight: 140,
        margin: 0,
        padding: 0        
      }
    },      

    midProfileImg:{
      display: "block",
      margin: "0 auto 30px",
      maxWidth: 200,
      maxHeight: 140,
    },

    detailTxt:{
      color: "#4C4C4C",
      fontSize: 16,
      margin: '0 0 20px',     
      padding: "0 16%",
      boxSizing: "border-box",
      [theme.breakpoints.down("md")]: {
        padding: "0",
      },
    },

    bottomTxt:{
      color: "#000000",
      fontSize: 14,
      fontWeight: 600      
    }

});

export default styles;
