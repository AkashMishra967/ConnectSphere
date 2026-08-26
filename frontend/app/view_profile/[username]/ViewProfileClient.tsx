"use client";

import clientServer, { BASE_URL } from "@/src/config";
import DashboardLayout from "@/src/layouts/DashboardLayouts";
import Userlayouts from "@/src/layouts/userlayouts";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import {
  getConnectionsRequest,
  getMyConnectionRequests,
  sendConnectionRequest,
} from "@/src/config/redux/action/authAction";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/src/config/redux/action/postAction";

export default function ViewProfileClient({ userProfile }) {
  const dispatch = useDispatch();

  const postState = useSelector((state) => state.posts);
  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);

  // Get posts and connection data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      await dispatch(getAllPosts());
      await dispatch(getConnectionsRequest({ token }));
      await dispatch(getMyConnectionRequests({ token }));
    };

    fetchData();
  }, [dispatch]);

  // Filter user's posts
  useEffect(() => {
    const posts = postState.posts.filter((post) => {
      return post.userId.username === userProfile.userId.username;
    });

    setUserPosts(posts);
  }, [postState.posts, userProfile]);

  // Find existing connection
  const existingConnection = authState.connection?.find((c) => {
    const otherUserId =
      c.userId._id === authState.user?.userId?._id
        ? c.connectionId._id
        : c.userId._id;

    return otherUserId === userProfile.userId._id;
  });

  // Connection status
  let connectionStatus = "none";

  if (existingConnection) {
    connectionStatus = existingConnection.status_accepted
      ? "connected"
      : "pending";
  }

  // Send connection request
  const handleConnect = () => {
    dispatch(
      sendConnectionRequest({
        connectionId: userProfile.userId._id,
      })
    ).then(() => {
      dispatch(getConnectionsRequest());
    });
  };

  return (
    <Userlayouts>
      <DashboardLayout>
        <div className={styles.container}>
          {/* Profile Header Block */}
          <div className={styles.headerSection}>
            <div className={styles.backDropContainer}>
              <img
                className={styles.backDrop}
                src={userProfile.userId.profilePicture}
                alt="profile"
              />
            </div>

            <div className={styles.profileMetaContainer}>
              <div className={styles.userInfoGroup}>
                <div className={styles.nameHeader}>
                  <h2>{userProfile.userId.name}</h2>
                  <p className={styles.username}>
                    @{userProfile.userId.username}
                  </p>
                </div>

                <div className={styles.actionGroup}>
                  {connectionStatus === "connected" && (
                    <button className={styles.connectedButton}>
                      Connected
                    </button>
                  )}

                  {connectionStatus === "pending" && (
                    <button
                      className={styles.pendingButton}
                      disabled
                    >
                      Pending
                    </button>
                  )}

                  {connectionStatus === "none" && (
                    <button
                      onClick={handleConnect}
                      className={styles.connectionBtn}
                    >
                      Connect
                    </button>
                  )}

                  {/* Download Resume */}
                  <div
                    className={styles.downloadIconWrapper}
                    title="Download Resume"
                    onClick={async () => {
                      const response = await clientServer.get(
                        `/user/download_resume?id=${userProfile.userId._id}`
                      );

                      window.open(
                        `${BASE_URL}/${response.data.message}`,
                        "_blank"
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className={styles.downloadIcon}
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

              {userProfile.bio && (
                <p className={styles.userBio}>{userProfile.bio}</p>
              )}
            </div>
          </div>

          {/* Body Content Grid */}
          <div className={styles.contentGrid}>
            {/* Work History */}
            <div className={styles.sectionCard}>
              <h3 className={styles.sectionTitle}>Work History</h3>
              <div className={styles.workHistoryContainer}>
                {userProfile.pastWork && userProfile.pastWork.length > 0 ? (
                  userProfile.pastWork.map((work, index) => (
                    <div
                      key={index}
                      className={styles.workHistoryCard}
                    >
                      <div className={styles.workHeader}>
                        <span className={styles.companyName}>{work.company}</span>
                        <span className={styles.positionTitle}>{work.position}</span>
                      </div>
                      <p className={styles.workYears}>{work.years}</p>
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyState}>No work history provided.</p>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.sectionCard}>
              <h3 className={styles.sectionTitle}>Recent Activity</h3>
              <div className={styles.activityList}>
                {userPosts.length === 0 ? (
                  <p className={styles.emptyState}>No posts yet</p>
                ) : (
                  userPosts.map((post) => (
                    <div key={post._id} className={styles.postCard}>
                      {post.media && (
                        <div className={styles.mediaContainer}>
                          <img src={post.media} alt="Post media" />
                        </div>
                      )}
                      <p className={styles.postBody}>{post.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </Userlayouts>
  );
}