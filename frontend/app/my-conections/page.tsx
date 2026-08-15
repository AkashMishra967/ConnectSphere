"use client"
import React, { useEffect } from 'react'
import DashboardLayout from "@/src/layouts/DashboardLayouts";
import Userlayouts from "@/src/layouts/userlayouts";
import { useDispatch, useSelector } from 'react-redux';
import styles from "./index.module.css";
import { getMyConnectionRequests } from '@/src/config/redux/action/authAction';
import { BASE_URL } from '@/src/config';
export default function MyConnectionPage() {

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth)

useEffect(() =>{
  dispatch(getMyConnectionRequests({token: localStorage.getItem("token")}));

}, [])


useEffect(() =>{
  if(authState.connectionRequest.length!=0){
    console.log(authState.connectionRequest)
  }
},[authState.connectionRequest])



  return (
    <Userlayouts>
    <DashboardLayout>

      

  <h1>My Connections</h1>

{authState.connectionRequest.length != 0 && authState.connectionRequest.map((user, index) =>{
return(
  <div className={styles.userCard} key={index}>
<div style={{display:"flex",alignItems:"center"}}>
  <div className={styles.profilePictre}>
    <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt='' />
  </div>
  <div className={styles.userInfo}>
    <h3>{user.userId.name}</h3>
    <p>{user.userId.username}</p>
  </div>
</div>

  </div>


)


})}

    </DashboardLayout>
    </Userlayouts>
  )
}
