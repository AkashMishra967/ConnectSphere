"use client"
import React, { useEffect } from 'react'
import { useRouter } from "next/navigation";
import DashboardLayout from "@/src/layouts/DashboardLayouts";
import Userlayouts from "@/src/layouts/userlayouts";
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '@/src/config/redux/action/authAction';
import { BASE_URL } from '@/src/config';
import styles from "./index.module.css";

export default function DiscoverPage() {

const authState = useSelector((state) => state.auth)

const dispatch = useDispatch();
useEffect(() =>{
  if(!authState.all_profiles_fetched){
    dispatch(getAllUsers());
  }
},[])

const router = useRouter();


  return (
     <Userlayouts>
    <DashboardLayout>

  <h1>Discover Page</h1>

  <div className={styles.allUserProfile}>
    {authState.all_profiles_fetched && authState.all_users.map((user) =>{
      return(
        <div
        onClick={() =>{
router.push(`/view_profile/${user.userId.username}`)


        }}
        key={user._id} className={styles.userCard}>
          {user.userId.profilePicture && (
            <img className={styles.userCard_image} src={`${BASE_URL}/${user.userId.profilePicture}`} alt='profile' />
          )}

          <div>
          <h3>{user.userId.name}</h3>
          <p>{user.userId.username}</p>
          </div>
          </div>
      )
    })}
  </div>


    </DashboardLayout>
    </Userlayouts>
  )
}