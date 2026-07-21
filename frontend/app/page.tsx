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
      <p>Connect with Frinds without Exaggeration</p>
  <p> A true social media platform, with stories no blufs</p>
   <div 
              onClick={() => {
                router.push("/login")
              }} 
              className={styles.buttonJoin}
            >
              <p>Join Now</p>
            </div>
    </div>
    <div onClick={() =>{
 router.push("/login")

    }} className={styles.mainContainer_right}>
      <img src = "images/linkdin.svg" alt=" " />
    </div>
  </div>
 </div>
 
 </UserLayout>
  );
}