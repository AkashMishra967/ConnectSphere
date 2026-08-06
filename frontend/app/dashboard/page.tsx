"use client"
import { useRouter } from "next/navigation";
import React,{useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css"
import { getAllPosts } from "@/src/config/redux/action/postAction";
import { getAboutUser, getAllUsers } from "@/src/config/redux/action/authAction";
import { setTokenIsThere, setTokenIsNotThere } from "@/src/config/redux/reducer/authreducer";
import DashboardLayout from "@/src/layouts/DashboardLayouts";
import Userlayouts from "@/src/layouts/userlayouts";
import { BASE_URL } from "@/src/config";

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


if(authState.user){


  return(
    <Userlayouts>
    <DashboardLayout>
      <div className="scrollComponent">

<div className={styles.createPostContainer}>
{authState?.user?.userId?.profilePicture && (
  <img className={styles.userProfile} width={200}
    src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
    alt="Profile"
  />
 
)}
  <textarea name="" id=""></textarea>


<label htmlFor="fileUpload">
<div className={styles.Fab}>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>
</div>
</label>
<input type="file" hidden id="fileUpload"/>
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