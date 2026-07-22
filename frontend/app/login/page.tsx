"use client"
import Userlayouts from '@/src/layouts/userlayouts';
import { useRouter } from 'next/navigation';
import React, {useEffect,useState} from 'react';
import { useSelector } from 'react-redux';
import styles from "./style.module.css";

 function LoginComponent() {
  const authState = useSelector((state) => state.auth)
  const router = useRouter();

const [userLogingMethod, setUserLoginMethod] = useState(true);



  useEffect(() =>{
    if(authState.loggedIn){
      router.push("/dashboard")
    }
  })

  return (
   <Userlayouts>

    <div className={styles.container}>
    <div className={styles.cardContainer}>

<div className={styles.cardContainer_left}>
  <p className={styles.cardleft_heading}>{userLogingMethod ? "Sign in" : "Sign up"}</p>
<input className={styles.inputfield} type='text' placeholder='username' />




</div>

<div className={styles.inputContainer}></div>
<div>
  <input className={styles.inputField} type="text" placeholder='username'/>
  <input className={styles.inputField} type="text" placeholder='username'/>
</div>








<div className={styles.cardContainer_right}>

</div>
</div>

    </div>
   </Userlayouts>
  )
}

export default LoginComponent;