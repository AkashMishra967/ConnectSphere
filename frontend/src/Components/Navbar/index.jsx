"use client";

import React from 'react'
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/src/config/redux/reducer/authreducer";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NavBarComponent() {
  const router = useRouter();

  const dispatch = useDispatch();

const authState = useSelector((state)=> state.auth)
  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
       <div className={styles.logo} onClick={() =>{
  router.push("/")
}}>
 <Image 
  src="/images/image.png" 
  alt="Pro Connect Logo" 
  width={280} 
  height={75}
  style={{ width: "100%", height: "auto" }}
  priority
/>
</div>
        <div className={styles.navBarOptionContainer}>
{authState.profileFetched && <div>
  <div className={styles.navActions}>
    {/* <p>Hey, {authState.user.userId.name}</p> */}
    <p 
    onClick={() =>{
      router.push("/profile")
    }}
    className={styles.navLink}>Profile</p>

    <p onClick={() =>{
localStorage.removeItem("token")
router.push("/login")
dispatch(reset())

    }} className={`${styles.navLink} ${styles.navLinkMuted}`}>Logout</p>
  </div>
  
  </div>}


{!authState.profileFetched && 
          <div onClick={() =>{
            router.push("/login")
          }} className={styles.buttonJoin}>
            <p>Be a part</p>
          </div>}
        </div>
      </nav>
      
    </div>
  )
}

