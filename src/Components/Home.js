import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../Firebase/Firebase";
import { useHistory } from "react-router-dom";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "50px",
    paddingBottom: "25px",
    color: "#f0f0f0",
    minHeight: "20vh", // Add this
  },
  heading: {
    fontSize: "2.2em",
    fontWeight: "700",
  },
  subHeading: {
    fontSize: "1.6em",
  },
  channelDiv: {
    padding: "15px",
    width: "100%", // Add this
    boxSizing: "border-box", // Add this
    width: '200px'
  },
  channelContent: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    padding: "20px",
    alignItems: "center",
  },
  square: {
    height: "80px",
    width: "80px",
    backgroundColor: "#8fabbd66",
    fontSize: "2rem",
  },
  rootChannel: {
    height: "calc(100vh - 200px)", // Adjusted height calculation
    position: "relative", 
    padding: "15px",
    overflowY: "auto", // Changed from scroll to auto
    overflowX: "hidden", // Add this to prevent horizontal scroll
  },
  channelText: {
    paddingTop: "10px",
    fontSize: "1.2rem",
  },
  channelCard: {
    backgroundColor: "#1e2439",
    boxShadow:
      "0px 3px 4px -1px rgb(0 0 0 / 17%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
    color: "rgb(220, 221, 222)",
    height: "100%", // Add this
  },

  searchField: {
    width: "300px",
    marginBottom: "20px",
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgb(45 45 73)",
      borderRadius: "5px",
    },
    "& .MuiOutlinedInput-input": {
      color: "#fff",
    },
    "& .MuiInputLabel-root": {
      color: "#aaa",
    }
  }
  
}));

function Home() {
  const classes = useStyles();
  const [channels, setChannels] = useState([]);
  // Add new state for search
  const [searchTerm, setSearchTerm] = useState("");
  const history = useHistory();

  // ... existing useEffect and goToChannel function ...

  // Add filtered channels computation
  const filteredChannels = channels.filter(channel =>
    channel.channelName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    db.collection("channels")
      .orderBy("channelName", "asc")
      .onSnapshot((snapshot) => {
        setChannels(
          snapshot.docs.map((channel) => ({
            channelName: channel.data().channelName,
            id: channel.id,
          }))
        );
      });
  }, []);

  const goToChannel = (id) => {
    history.push(`/channel/${id}`);
  };

  return (
    <div style={{ backgroundColor: "rgb(34 39 59)", width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "100%"
     }}>
      <div  className={classes.root}>
        <div item xs={12} style={{ textAlign: "center" }}>
          <Typography component="h1" className={classes.heading}>
            Welcome to RT Chat
          </Typography>
          <Typography component="h1" className={classes.subHeading}>
            Effortless live chat to hangout with friends!
          </Typography>
        </div>
        <TextField
          className={classes.searchField}
          label="Search Channels"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div  className={classes.rootChannel} style={{
        display: "flex",
        flexWrap: "wrap",
        overflowY: "auto",
      }}>
        {filteredChannels.map((channel) => (
          <div
            item
            className={classes.channelDiv}
            key={channel.id}
          >
            <Card className={classes.channelCard}>
              <CardActionArea
                style={{ display: "flex" }}
                onClick={() => goToChannel(channel.id)}
              >
                <CardContent className={classes.channelContent}>
                  <Avatar
                    variant="square"
                    className={classes.square}
                    style={{ backgroundColor: "#6a9ec066" }}
                  >
                  {channel.channelName.substr(0, 1).toUpperCase().slice(0,20)}
                  </Avatar>
                  <Typography className={classes.channelText}>
                    {channel.channelName}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
