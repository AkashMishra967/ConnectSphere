"use client"
import { useRouter } from "next/navigation";
import React,{useEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/src/config/redux/action/postAction";
import { getAboutUser } from "@/src/config/redux/action/authAction";
import DashboardLayout from "@/src/layouts/DashboardLayouts";
import Userlayouts from "@/src/layouts/userlayouts";

export default function Dashboard(){

  const router = useRouter();
  const dispath = useDispatch()
  const authState = useSelector((state) => state.auth)

  const [isTokenThere,setIsTokenThere] = useState(false)

  useEffect(() =>{
    console.log("checking token:", localStorage.getItem('token'))
    if(localStorage.getItem('token') === null){
      router.push("/login")
    } else {
      setIsTokenThere(true)
    }
  },[router])

  useEffect(() =>{
    console.log("isTokenThere:", isTokenThere)
    if(isTokenThere){
      dispath(getAllPosts())
      dispath(getAboutUser({token: localStorage.getItem('token')}))
    }
  },[isTokenThere, dispath])

  return(
    <Userlayouts>
    <DashboardLayout>

  <h1>Dashboard</h1>


    </DashboardLayout>
    </Userlayouts>
  )
}