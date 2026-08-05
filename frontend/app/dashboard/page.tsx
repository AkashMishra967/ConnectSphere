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

  return(
    <Userlayouts>
    <DashboardLayout>
      <div className="scrollComponent">

<div className={styles.createPostContainer}>
{authState?.user?.userId?.profilePicture && (
  <img
    src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
    alt="Profile"
  />
)}
</div>

      </div>
    </DashboardLayout>
    </Userlayouts>
  )
}
