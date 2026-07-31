import { useRouter } from "next/router";
import React,{useEffect, useState} from 'react'
import { useDispatch } from "react-redux";

export default function Dashboard(){

  const router = useRouter();
  const dispath = useDispatch()

  const [isTokenThere,setIsTokenThere] = useState(false)

  useEffect(())
}