"use client"

import Userlayouts from "@/src/layouts/userlayouts";
import styles from "./index.module.css";
import clientServer, { BASE_URL } from "@/src/config";
import DashboardLayout from "@/src/layouts/DashboardLayouts";
import { getAboutUser } from "@/src/config/redux/action/authAction";
import { getAllPosts } from "@/src/config/redux/action/postAction";
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";

export default function ProfilePage(){

    const authState = useSelector((state) => state.auth)
    const postState = useSelector((state) => state.posts)
    const [userProfile, setUserProfile] = useState({})
    const [userPosts, setUserPosts] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAboutUser({token: localStorage.getItem("token")}))
        dispatch(getAllPosts())
    },[dispatch])

    useEffect(() => {
        setUserProfile(authState.user)
    },[authState.user])

    useEffect(() => {
        if(userProfile?.userId){
            let posts = postState.posts.filter((post) => {
                return post.userId.username === userProfile.userId.username
            })
            setUserPosts(posts);
        }
    },[postState.posts, userProfile])

const updateProfilePicture = async(file) =>{
    const formData = new FormData();
    formData.append("profile_picture",file);
    formData.append("token",localStorage.getItem("token"));
    const response = await clientServer.post("/update_profile_picture",formData,{
        headers:{
            'Content-Type':'multipart/form-data',
        },
    });
    dispatch(getAboutUser({token: localStorage.getItem("token")}))
}




    return(
        <Userlayouts>
            <DashboardLayout>

{authState.user && userProfile?.userId &&

 <div className={styles.container}>
          {/* Profile Cover */}
          <div className={styles.backDropContainer}>
           
                <label  htmlFor="profilePictureUpload" className={styles.backDrop_overlay}>
                    <p>Edit</p>
                </label>
                <input 
                onChange={(e) =>{
                   updateProfilePicture(e.target.files[0])
                }}
                hidden type="file" id="profilePictureUpload" />
            <img
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt="profile"
            />
            
          </div>

          {/* Profile Details */}
          <div className={styles.profileContainer_details}>
            <div
              style={{ display: "flex",gap: "0.7rem",
              }}
            >
              <div style={{ flex: "0.8rem" }}>
                {/* Name and Username */}
                <div
                  style={{ display: "flex",width: "fit-content",alignItems: "center",gap: "1.2rem", }} >
                  <h2>{userProfile.userId.name}</h2>

                  <p style={{ color: "gray" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>

                {/* Download Resume */}
                <div style={{ display: "flex", alignItems: "center",gap: "1.2rem",}}>
                  <div
                    onClick={async () => {
                      const response = await clientServer.get(
                        `/user/download_resume?id=${userProfile.userId._id}`
                      );

                      window.open(
                        `${BASE_URL}/${response.data.message}`,
                        "_blank"
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <svg
                      style={{ width: "1.2em" }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p>{userProfile.bio}</p>

              {/* Recent Activity */}
              <div style={{ flex: "0.2rem" }}>
                <h3>Recent Activity</h3>

                {userPosts.length === 0 && (
                  <p style={{ color: "gray" }}>
                    No posts yet
                  </p>
                )}

                {userPosts.map((post) => {
                  return (
                    <div
                      key={post._id}
                      className={styles.postCard}
                    >
                      <div className={styles.card}>
                        <div
                          className={
                            styles.card_profileContainer
                          }
                        >
                          {post.media !== "" && (
                            <img
                              src={`${BASE_URL}/${post.media}`}
                              alt=""
                            />
                          )}
                        </div>

                        <p>{post.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Work History */}
          <div className="workHistory">
            <h4>Work History</h4>

            <div className={styles.workHistoryContainer}>
              {userProfile.pastWork?.map((work, index) => {
                return (
                  <div
                    key={index}
                    className={styles.workHistoryCard}
                  >
                    <p
                      style={{fontWeight: "bold",display: "flex",alignItems: "center",  gap: "0.8rem", }} >
                      {work.company} - {work.position}
                    </p>

                    <p>{work.years}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>


            }

            </DashboardLayout>
        </Userlayouts>
    )
}
