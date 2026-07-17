"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation"; 


export default function Home() {
  const router = useRouter();
  return (
 <>
 <div className="container">
  <div className="mainContainer">
    <div className="mainContainer_left">
      <p>Connect with Frinds without Exaggeration</p>
  <p> A true social media platform, with stories no blufs</p>
  <div className="buttonJoin">
    <p>Join Now</p>
  </div>
    </div>
    <div onClick={() =>{
 router.push("/login")

    }} className="mainContainer_right">
      <img src = "images/linkdin.svg" alt=" " />
    </div>
  </div>
 </div>
 
 </>
  );
}