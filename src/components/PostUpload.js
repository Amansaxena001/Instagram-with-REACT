import React,{useState} from 'react'
import { Button ,TextField } from '@material-ui/core';
import{storage,db} from '../firebase'
import '../css/PostUpload.css'

import firebase from'firebase'


function PostUpload({username}) {

  const [caption, setCaption]=useState('')
const [image, setImage]=useState(null)
const [progress, setProgress]=useState('')


//fileupload ***selecting files
const handleChange=(e)=>{
  if(e.target.files[0]){
    setImage(e.target.files[0])
  }
}

const handleUpload=(e)=>{
  const uploadTask =storage.ref(`images/${image.name}`).put(image)
  uploadTask.on(
    "state_changed",
    (snapshot)=>{
      //progess logic ...
       const progress=Math.round(
         (snapshot.bytesTransferred /snapshot.totalBytes) *100
       );

       setProgress(progress)
    },
    (error)=>{
      console.log(error)
    },
    //when upload completes
    ()=>{
      storage
      .ref("images")
      .child(image.name)
      .getDownloadURL()
      .then(url=>{
        //post in db
        db.collection("posts").add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          caption:caption,
          imageUrl:url,
          username:username
        });
        setProgress(0);
        setCaption("")
        setImage(null)
      })
    }
  )
}

  return (
    <div className="image__upload">
      <progress className="progress"value={progress} max="100"/>
      <input type="text" placeholder="Enter caption ..."  value={caption} onChange={event=>setCaption(event.target.value)}/>
      <input type="file"  onChange={handleChange}/>
      <Button onClick={handleUpload} >Upload</Button>    
    </div>
  )
}

export default PostUpload
