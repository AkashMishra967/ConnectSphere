"use client"
import { useRouter } from "next/navigation";
import React,{useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css"
import { createPost, getAllPosts } from "@/src/config/redux/action/postAction";
import { getAboutUser, getAllUsers } from "@/src/config/redux/action/authAction";
import { setTokenIsThere, setTokenIsNotThere } from "@/src/config/redux/reducer/authreducer";
import DashboardLayout from "@/src/layouts/DashboardLayouts";
import Userlayouts from "@/src/layouts/userlayouts";
import { BASE_URL } from "@/src/config";
import { serialize } from "v8";
import { create } from "domain";

export default function Dashboard(){

  const router = useRouter();
  const dispath = useDispatch()
  const authState = useSelector((state) => state.auth)
  console.log("Auth State:", authState);
console.log("User:", authState.user);

  useEffect(() =>{
    const token = localStorage.getItem('token');
    if(token){
      dispath(setTokenIsThere())
    } else {
      dispath(setTokenIsNotThere())
    }
  },[dispath])

  useEffect(() =>{
    if(authState.isTokenThere){
      dispath(getAllPosts())
      dispath(getAboutUser({token: localStorage.getItem('token')}))
    }
    if(!authState.all_profiles_fetched){
      dispath(getAllUsers());
    }
  },[authState.isTokenThere, authState.all_profiles_fetched, dispath])



const [postContent, setPostContent] = useState(""); 
const [fileContent, setFileContent] = useState(); 

const handleUpload = async() =>{
  await dispath(createPost({file: fileContent, body:postContent}));
  setPostContent("");
  setFileContent(null)
}


if(authState.user){


  return(
    <Userlayouts>
    <DashboardLayout>
      <div className={styles.scrollComponent}>

<div className={styles.createPostContainer}>
{authState?.user?.userId?.profilePicture && (
  <img className={styles.userProfile} width={200}
    src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
    alt="Profile"
  />
 
)}
  <textarea onChange={(e) =>
setPostContent(e.target.value)}
value={postContent}
 placeholder={"what's in your mind?"}className={styles.textAreaOfContent} name="" id=""></textarea>



<label htmlFor="fileUpload">
<div className={styles.Fab}>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>
</div>
</label>
<input onChange={(e) => setFileContent(e.target.files[0])} type="file" hidden id="fileUpload"/>
{postContent.length > 0 &&
<div onClick={handleUpload} className={styles.uploadButton}>Post</div>
}
</div>

      </div>
    </DashboardLayout>
    </Userlayouts>
  )
}else{
  return(
    <Userlayouts>
    
    <DashboardLayout>
    
    <h2>Loading.</h2>
    </DashboardLayout>
    </Userlayouts>
  )
}
}