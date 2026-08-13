"use client"
import { BASE_URL } from '@/src/config';
import DashboardLayout from '@/src/layouts/DashboardLayouts';
import Userlayouts from '@/src/layouts/userlayouts';
import styles from "./index.module.css";
import { useEffect, useState } from 'react';
// import { sendConnectionRequest } from "@/src/config/redux/action/authAction";
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/src/config/redux/action/postAction';

export default function ViewProfileClient({ userProfile }) {

    const dispatch = useDispatch();
    const postState = useSelector((state) => state.posts);
    const authState = useSelector((state) => state.auth);

    const [userPosts, setUserPosts] = useState([]);
    const [isCurrentUserInConnection, setIsConnection] = useState(false);

    useEffect(() => {
        dispatch(getAllPosts());
    }, [dispatch]);

    useEffect(() => {
        let posts = postState.posts.filter((post) => {
            return post.userId.username === userProfile.userId.username
        })
        setUserPosts(posts);
    }, [postState.posts, userProfile]);

    const handleConnect = () => {
          console.log("Connect feature coming soon");
        // dispatch(sendConnectionRequest({ token: localStorage.getItem("token"), connectionId: userProfile.userId._id }))
    }

    return (
        <Userlayouts>
            <DashboardLayout>
                <div className={styles.container}>
                    <div className={styles.backDropContainer}>
                        <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="profile" />
                    </div>
                    <div className={styles.profileContainer_details}>

                        <div style={{ display: "flex", gap: "0.7rem" }}>

                            <div style={{ flex: "0.8rem" }}>
                                <div style={{ display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem" }}>
                                    <h2>{userProfile.userId.name}</h2>
                                    <p style={{ color: "gray" }}>@{userProfile.userId.username}</p>
                                </div>

                                {isCurrentUserInConnection ? (
                                    <button className={styles.connectedButton}>Connected</button>
                                ) : (
                                    <button onClick={handleConnect} className={styles.connectionBtn}>Connect</button>
                                )}
                            </div>
                            <p>{userProfile.bio}</p>

                            <div style={{ flex: "0.2rem" }}>
    <h3>Recent Activity</h3>
    {userPosts.length === 0 && <p style={{color: "gray"}}>No posts yet</p>}
    {userPosts.map((post) => {
                                    return (
                                        <div key={post._id} className={styles.postCard}>
                                            <div className={styles.card}>
                                                <div className={styles.card_profileContainer}>
                                                    {post.media !== "" && (
                                                        <img src={`${BASE_URL}/${post.media}`} alt='' />
                                                    )}
                                                </div>
                                                <p>{post.body}</p>
                                            </div>
                                        </div>
                                    )
                                })}

                            </div>
                        </div>

                    </div>
                </div>
            </DashboardLayout>
        </Userlayouts>
    )
}
