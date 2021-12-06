import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  root: {
    height: 20,
    width: 30,
    marginRight: 17,
    backgroundColor: (show) => (show ? "#3F92FF" : "inherit"),
    borderRadius: 10,
  },
  msgCount: {
    height: 14,
    textAlign: "center",
    fontFamily: "Open Sans",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 10,
    letterSpacing: -0.5,
    color: "#FFFFFF",
  },
}));

const PendingRead = (props) => {
  const { counts } = props;
  const classes = useStyles(counts > 0);

  return (
    <Box className={classes.root}>
      {counts > 0 && (
        <Typography className={classes.msgCount}>{counts}</Typography>
      )}
    </Box>
  );
};

export default PendingRead;
