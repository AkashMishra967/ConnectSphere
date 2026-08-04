"use client"
import React, { useEffect } from 'react'
import DashboardLayout from "@/src/layouts/DashboardLayouts";
import Userlayouts from "@/src/layouts/userlayouts";
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '@/src/config/redux/action/authAction';
export default function DiscoverPage() {

const authState = useSelector((state) => state.auth)

const dispatch = useDispatch();
useEffect(() =>{
  if(!authState.all_profiles_fetched){
    dispatch(getAllUsers());
  }
},[])




  return (
     <Userlayouts>
    <DashboardLayout>

  <h1>Discover Page</h1>


    </DashboardLayout>
    </Userlayouts>
  )
}
