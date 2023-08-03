const styles = (theme) => ({
  root: {
    marginBottom: 0,
    padding: "0 48px",
    height: 130,
  },
  /****Sub Header ****/
  headingTop: {
    fontWeight: 400,
    fontSize: 34,
    color: "#002D43",
    padding: "21px 0",
  },
  logoWrap: {
    padding: "0.70rem 1.875rem",
    fontSize: 16,
    color: "#051b2",
  },
  headerBottom: {
    width: "auto",
    padding: 5,
    fontSize: 14,
    borderBottom: 0,
    fontWeight: 500,
    marginBottom: 10,
  },

  /*******Pill Orange Button **********/
  mediumBtn: {
    width: "150px",
    height: "48px",
    fontSize: "14px",
    color: "#FFFFFF",
    borderRadius: "28px",
    backgroundColor: "#008CE6",
    boxShadow:
      "0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2)",
    "&:hover": {
      color: "#FFFFFF",
      backgroundColor: "#008CE6",
      borderRadius: "28px",
    },
  },
});

export default styles;
