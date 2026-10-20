"use client";

import styles from "./page.module.css";
import { useRouter } from "next/navigation"; 
import UserLayout from "../src/layouts/userlayouts";


export default function Home() {
  const router = useRouter();
  return (
 <UserLayout>
 <div className={styles.container}>
  <div className={styles.mainContainer}>
    <div className={styles.mainContainer_left}>
      <h1 className={styles.heading}>Connect with friends, without the exaggeration.</h1>
      <p className={styles.subheading}>A social platform for real stories and honest profiles. No bluff, just people.</p>
   <div 
              onClick={() => {
                router.push("/login")
              }} 
              className={styles.buttonJoin}
            >
              <p>Join now</p>
            </div>
    </div>
    <div onClick={() =>{
 router.push("/login")

    }} className={styles.mainContainer_right}>
      <img src = "images/linkdin.svg" alt="People connecting on ConnectSphere" />
    </div>
  </div>
 </div>
 
 </UserLayout>
  );
}

