import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import "./App.css";
import Posts from "./components/Posts";
import { db, auth } from "./firebase";
import { Button, TextField } from "@material-ui/core";
import PostUpload from "./components/PostUpload";

import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [openSignin, setOpenSignin] = useState(false);
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmal] = useState("");
  const [user, setUser] = useState(null);

  //useefect runs peice of code on specfic condition

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //everytime a new post added or deleted it is fired
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  useEffect(() => {
    const unsuscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        setUser(authUser); //cookie tracking
        if (authUser.displayName) {
          //dont update user
        } else {
          //new user created
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      //cleanup
      unsuscribe();
    };
  }, [user, username]);

  //create user and save to DB
  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };
  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignin(false);
  };

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app__headerImage"
                src="https://image.flaticon.com/icons/png/512/87/87390.png"
                alt=""
              />
            </center>
            <TextField
              autoComplete="fname"
              name="firstName"
              variant="outlined"
              required
              fullWidth
              value={username}
              label="username"
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={email}
              id="email"
              label="Email Address"
              onChange={(e) => setEmal(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              value={password}
              label="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              onClick={signUp}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>
      <div></div>
      <Modal open={openSignin} onClose={() => setOpenSignin(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app__headerImage"
                src="https://image.flaticon.com/icons/png/512/87/87390.png"
                alt=""
              />
            </center>

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={email}
              id="email"
              label="Email Address"
              onChange={(e) => setEmal(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              value={password}
              label="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              onClick={signIn}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
      <div className="__header">
        <img
          className="__headerimage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        ></img>

        {user ? (
          <button type="button" onClick={() => auth.signOut()}>
            Logout
          </button>
        ) : (
          <div>
            <button onClick={() => setOpen(true)}>Sign Up </button>
            <button onClick={() => setOpenSignin(true)}>Sign In </button>
          </div>
        )}
      </div>
      <div className="app__post">
        <div className="app__postleft">
        {posts.map(({ id, post }) => (
          <Posts
            key={id}
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
            postId={id}
            user={user}
          />
        ))}
        </div>
        <div className="app__postright">
        <InstagramEmbed
        url="https://www.instagram.com/p/CCrrMwNnwXT/"
        maxWidth={420}
        hideCaption={false}
        containerTagName="div"
        protocol=""
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
       <InstagramEmbed
        url="https://www.instagram.com/p/CA5oWbOnecq/"
        maxWidth={420}
        hideCaption={false}
        containerTagName="div"
        protocol=""
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
      </div>
      </div>
      
      
  
      {user?.displayName ? (
        <PostUpload className="app__upload" username={user.displayName} />
      ) : (
        <h3>Sorry login to continue</h3>
      )}
    </div>
  );
}

export default App;
