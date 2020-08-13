import React,{useState,useEffect} from 'react'
import '../css/Post.css'
import Avatar from '@material-ui/core/Avatar'
import {db}from '../firebase'
import ChatBubbleOutlineRoundedIcon from '@material-ui/icons/ChatBubbleOutlineRounded';
import firebase from 'firebase'
function Posts({postId,username,user,caption,imageUrl}) {

    const [comments, setComments]=useState([])
    const [comment,setComment]=useState('')
    const [icon,setIcon]=useState(false)

    useEffect(()=>{
        let Unsubscribe;
        if(postId){
            Unsubscribe=db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()))
            })
        }
        return()=>{
            Unsubscribe();
        }
    },[postId])


    const postComment=(e)=>{

        e.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('');
        

    }
   
  
    
    return (
      <div className="post">
        <div className="post__header">
          <Avatar
            className="post__avatar"
            alt="Aman"
            src="/static/images/avatar/1.jpg"
          />
          <h3>{username}</h3>
        </div>

        <img className="post__image" src={imageUrl} />
        <h4 className="post__text">
          <strong>{username}</strong>
          {caption}
        </h4>

        <div className="post__comments">
          {comments.map((comment) => (
            <p>
              <strong>{comment.username}</strong> {comment.text}
            </p>
          ))}
        </div>

        {user && (
          <ChatBubbleOutlineRoundedIcon 
            value={icon}
            onClick={()=>setIcon(true)}

            style={{cursor:'pointer'}}
          />
          

        )}
        {
        
          icon ?
          
          <form className="post__commentBox">
          <input
            className="post__input"
            value={comment}
            placeholde="Add a new comment ..."
            type="text"
            onChange={(e) => setComment(e.target.value)}
          />
          <button
          
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>:
        null
        }
       
      </div>
    );
}

export default Posts



