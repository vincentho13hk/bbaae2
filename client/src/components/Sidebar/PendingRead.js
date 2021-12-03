import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  root: {
    height: 20,
    width: 30,
    marginRight: 17,
    backgroundColor: "#3F92FF",
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
  const classes = useStyles();
  const { counts } = props;
  const displayCount = counts < 10 ? counts : "9+";

  return counts === 0 ? (
    <></>
  ) : (
    <Box className={classes.root}>
      <Typography className={classes.msgCount}>{displayCount}</Typography>
    </Box>
  );
};

export default PendingRead;
