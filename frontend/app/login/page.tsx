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
const [formError, setFormError] = useState("");


  useEffect(() =>{
    if(authState.loggedIn){
      router.push("/dashboard")
    }
  },[authState.loggedIn, router]);


const handlerRegister = async () =>{
  console.log("registering ...");
  try{
    await dispath(registerUser({username,password,email,name})).unwrap();
    // Register successful - login mode pe switch karo, dashboard pe mat bhejo
    setUserLoginMethod(true);
  }catch(err){
    // error already authState.message mein handle ho raha hai
    console.log("register failed", err);
  }
}
const handlerLogin = () =>{
  console.log("logging in ...");
  dispath(loginUser({email,password}))
}

const validateForm = () => {
  if(userLogingMethod){
    // Sign in mode - sirf email, password chahiye
    if(!email.trim() || !password.trim()){
      setFormError("Email and Password are required");
      return false;
    }
  }else{
    // Sign up mode - sab fields chahiye
    if(!username.trim() || !name.trim() || !email.trim() || !password.trim()){
      setFormError("All fields are required");
      return false;
    }
  }
  setFormError("");
  return true;
}

const handleSubmit = () => {
  if(!validateForm()) return;

  if(userLogingMethod){
    handlerLogin();
  }else{
    handlerRegister();
  }
}

  return (
   <Userlayouts>

    <div className={styles.container}>
    <div className={styles.cardContainer}>

<div className={styles.cardContainer_left}>
  <p className={styles.cardleft_heading}>{userLogingMethod ? "Sign in" : "Sign up"}</p>
<p style={{color:authState.isError ? "red":"green"}}>{authState.message}</p>
{formError && <p style={{color:"red"}}>{formError}</p>}

<div className={styles.inputContainers}>
{!userLogingMethod  && 
<div className={styles.inputRow}>
  <input onChange = {(e) =>{setUsername(e.target.value)
  }} className={styles.inputField} type="text" placeholder='username'/>
  <input onChange = {(e) =>{setName(e.target.value)
  }}className={styles.inputField} type="text" placeholder='Name'/>
</div>}
<input onChange ={(e) =>{
  setEmailAddress(e.target.value)
}}className={styles.inputField} type="text" placeholder='email'/>
<input onChange = {(e) => setPassword(e.target.value)}
className={styles.inputField} type="password" placeholder='Password'/>

<div onClick={handleSubmit}

 className={styles.buttonWithOutline}>
  <p>{userLogingMethod ?"Sign In" :"Sign Up"}</p>
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
