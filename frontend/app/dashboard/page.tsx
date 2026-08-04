"use client"
import { useRouter } from "next/navigation";
import React,{useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/src/config/redux/action/postAction";
import { getAboutUser, getAllUsers } from "@/src/config/redux/action/authAction";
import { setTokenIsThere, setTokenIsNotThere } from "@/src/config/redux/reducer/authreducer";
import DashboardLayout from "@/src/layouts/DashboardLayouts";
import Userlayouts from "@/src/layouts/userlayouts";

export default function Dashboard(){

  const router = useRouter();
  const dispath = useDispatch()
  const authState = useSelector((state) => state.auth)

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
      <h1>Dashboard</h1>
    </DashboardLayout>
    </Userlayouts>
  )
}
