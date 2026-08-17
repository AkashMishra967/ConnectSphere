"use client"
import React, { useEffect } from 'react'
import DashboardLayout from "@/src/layouts/DashboardLayouts";
import Userlayouts from "@/src/layouts/userlayouts";
import { useDispatch, useSelector } from 'react-redux';
import styles from "./index.module.css";
import { AcceptConnection, getMyConnectionRequests } from '@/src/config/redux/action/authAction';
import { BASE_URL } from '@/src/config';
import { useRouter } from "next/navigation";   
export default function MyConnectionPage() {

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth)

useEffect(() =>{
  dispatch(getMyConnectionRequests({token: localStorage.getItem("token")}));

}, [])



const router = useRouter();


useEffect(() =>{
  if(authState.connectionRequest.length!=0){
    console.log(authState.connectionRequest)
  }
},[authState.connectionRequest])



  return (
    <Userlayouts>
    <DashboardLayout>

      <div style={{display:"flex",flexDirection:"column",gap:"1.7rem"}}>

  <h4>My Connection</h4>

{authState.connectionRequest.length === 0 && <h1>No Connection Request Pending</h1>}

{authState.connectionRequest.length != 0 && authState.connectionRequest.filter((connection) =>connection.status_accepted === null).map((user, index) =>{
return(
  <div 
  onClick={() =>{
    router.push(`/view_profile/${user.userId.username}`)

  }}
  
  className={styles.userCard} key={index}>
<div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
  <div className={styles.profilePictre}>
    <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt='' />
  </div>
  <div className={styles.userInfo}>
    <h3>{user.userId.name}</h3>
    <p>{user.userId.username}</p>
  </div>

<div onClick={(e) =>{
e.stopPropagation();
dispatch(AcceptConnection({
  connectionId:user._id,
  token: localStorage.getItem("token"),
  action:"accept",
}))




}}>
<button className={styles.connectedButton}>Accept</button>
</div>

</div>
  </div>

)
})}



<h4>My Network</h4>
{authState.connectionRequest.map((request) => (
  <p key={request._id}>{request.userId.name}</p>
))}
{authState.connectionRequest.filter((connection) => connection.status_accepted !== null ).map((user,index) =>{
return(

  
<div 
  onClick={() =>{
    router.push(`/view_profile/${user.userId.username}`)

  }}
  
  className={styles.userCard} key={index}>
<div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
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


</div>
    </DashboardLayout>
    </Userlayouts>
  )
}
