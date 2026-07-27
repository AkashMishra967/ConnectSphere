"use client"
import Userlayouts from '@/src/layouts/userlayouts';
import { useRouter } from 'next/navigation';
import React, {useEffect,useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from "./style.module.css";
import { loginUser, registerUser } from '@/src/config/redux/action/authAction';

 function LoginComponent() {
  const authState = useSelector((state) => state.auth)
  const router = useRouter();
  const dispath = useDispatch();

const [userLogingMethod, setUserLoginMethod] = useState(false);
const [email, setEmailAddress] = useState("");
const [username, setUsername] = useState("");
const [name, setName] = useState("");
const [password, setPassword] = useState("");


  useEffect(() =>{
    if(authState.loggedIn){
      router.push("/dashboard")
    }
  },[authState.loggedIn, router]);


const handlerRegister = () =>{
  console.log("registering ...");
  dispath(registerUser({username,password,email,name}))
}
const handlerLogin = () =>{
  console.log("logging in ...");
  dispath(loginUser({email,password}))
}
  return (
   <Userlayouts>

    <div className={styles.container}>
    <div className={styles.cardContainer}>

<div className={styles.cardContainer_left}>
  <p className={styles.cardleft_heading}>{userLogingMethod ? "Sign in" : "Sign up"}</p>
<p style={{color:authState.isError ? "red":"green"}}>{authState.message}</p>

<div className={styles.inputContainers}>
<div className={styles.inputRow}>
  <input onChange = {(e) =>{
    setUsername(e.target.value)
  }} className={styles.inputField} type="text" placeholder='username'/>
  <input onChange = {(e) =>{
setName(e.target.value)
  }}className={styles.inputField} type="text" placeholder='Name'/>
</div>
<input onChange ={(e) =>{
  setEmailAddress(e.target.value)
}}className={styles.inputField} type="text" placeholder='email'/>
<input onChange = {(e) => setPassword(e.target.value)}
className={styles.inputField} type="password" placeholder='Password'/>

<div onClick={() =>{
  if(userLogingMethod){
    handlerLogin();
  }
  else{
    handlerRegister();
  }
}}

 className={styles.buttonWithOutline}>
  <p>{userLogingMethod ?"Sign In" :"Sigin Up"}</p>
</div>




<div onClick={() => setUserLoginMethod(!userLogingMethod)} style={{cursor:"pointer", textDecoration:"underline"}}>
  <p>{userLogingMethod ? "Don't have an account? Sign up" : "Already have an account? Sign in"}</p>
</div>

<div className={styles.cardContainer_right}>

</div>
</div>
</div>
</div>


    </div>
   </Userlayouts>
  )
}

export default LoginComponent;