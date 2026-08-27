"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import DashboardLayout from "@/src/layouts/DashboardLayouts";
import Userlayouts from "@/src/layouts/userlayouts";
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '@/src/config/redux/action/authAction';
import { BASE_URL } from '@/src/config';
import styles from "./index.module.css";

export default function DiscoverPage() {

const authState = useSelector((state) => state.auth)
const [searchTerm, setSearchTerm] = useState("");

const dispatch = useDispatch();
useEffect(() =>{
  if(!authState.all_profiles_fetched){
    dispatch(getAllUsers());
  }
},[])

const router = useRouter();
const filteredUsers = authState.all_profiles_fetched
  ? authState.all_users.filter((user) =>
      user.userId &&
      (user.userId.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId.username?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  : [];
  return (
     <Userlayouts>
    <DashboardLayout>

  <div className={styles.pageHeader}>
    <h1 className={styles.pageTitle}>Discover People</h1>
    <p className={styles.pageSubtitle}>Connect with professionals in your network</p>
  </div>

  <div className={styles.searchBar}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.searchIcon}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
    <input
      type="text"
      placeholder="Search by name or username..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className={styles.searchInput}
    />
  </div>

  <div className={styles.allUserProfile}>
    {filteredUsers.map((user) =>{
      return(
        <div
        onClick={() =>{
          router.push(`/view_profile/${user.userId.username}`)
        }}
        key={user._id} className={styles.userCard}>

          <div className={styles.userCard_imageWrapper}>
            {user.userId.profilePicture ? (
              <img className={styles.userCard_image} src={user.userId.profilePicture} alt='profile' />
            ) : (
              <div className={styles.userCard_placeholder}>
                {user.userId.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className={styles.userCard_info}>
            <h3 className={styles.userCard_name}>{user.userId.name}</h3>
            <p className={styles.userCard_username}>@{user.userId.username}</p>
          </div>

          <button
            className={styles.viewProfileBtn}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/view_profile/${user.userId.username}`)
            }}
          >
            View Profile
          </button>
          </div>
      )
    })}

    {authState.all_profiles_fetched && filteredUsers.length === 0 && (
      <p className={styles.noResults}>No users found matching "{searchTerm}"</p>
    )}
  </div>


    </DashboardLayout>
    </Userlayouts>
  )
}
