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
          {/* Profile Header and Metadata */}
          <div className={styles.profileHeaderCard}>
            <div className={styles.backDropContainer}>
    {userProfile.userId.profilePicture ? (
        <img 
            className={styles.profilePicture} 
            src={userProfile.userId.profilePicture} 
            alt="profile"
            onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
            }}
        />
    ) : null}
    <div 
        className={styles.profilePicture}
        style={{
            display: userProfile.userId.profilePicture ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, rgb(0,59,130), rgb(3,93,183))",
            color: "white",
            fontSize: "2.5rem",
            fontWeight: "bold"
        }}
    >
        {userProfile.userId.name?.charAt(0).toUpperCase()}
    </div>
</div>

            <div className={styles.metaDataWrapper}>
              <div className={styles.mainInfoBlock}>
                <div className={styles.nameBlock}>
                  <h1 className={styles.fullName}>{userProfile.userId.name}</h1>
                  <span className={styles.usernameHandle}>
                    @{userProfile.userId.username}
                  </span>
                </div>

                <div className={styles.connectionActions}>
                  {connectionStatus === "connected" && (
                    <button className={styles.statusBadgeConnected}>
                      Connected
                    </button>
                  )}

                  {connectionStatus === "pending" && (
                    <button
                      className={styles.statusBadgePending}
                      disabled
                    >
                      Pending
                    </button>
                  )}

                  {connectionStatus === "none" && (
                    <button
                      onClick={handleConnect}
                      className={styles.connectButtonMain}
                    >
                      Connect
                    </button>
                  )}

                  {/* Download Resume with enhanced interaction */}
                  <div
                    className={styles.downloadResumeAction}
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
                      className={styles.resumeIcon}
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
                <p className={styles.profileBioText}>{userProfile.bio}</p>
              )}
            </div>
          </div>

          {/* Detailed Content Sections */}
          <div className={styles.splitContentLayout}>
            {/* Left Column: Work History */}
            <div className={styles.contentSectionBlock}>
              <div className={styles.sectionHeadingWrapper}>
                <h2 className={styles.sectionTitleText}>Work History</h2>
                {userProfile.pastWork && userProfile.pastWork.length > 0 && (
                  <span className={styles.workCountBadge}>{userProfile.pastWork.length}</span>
                )}
              </div>
              <div className={styles.workHistoryList}>
                {userProfile.pastWork && userProfile.pastWork.length > 0 ? (
                  userProfile.pastWork.map((work, index) => (
                    <div
                      key={index}
                      className={styles.workExperienceCard}
                    >
                      <div className={styles.workDetailsHeader}>
                        <span className={styles.workCompanyName}>{work.company}</span>
                        <span className={styles.workPositionTitle}>{work.position}</span>
                      </div>
                      <p className={styles.workDurationText}>{work.years}</p>
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyDataMessage}>Add your professional experience here.</p>
                )}
              </div>
            </div>

            {/* Right Column: Recent Activity */}
            <div className={styles.contentSectionBlock}>
              <div className={styles.sectionHeadingWrapper}>
                <h2 className={styles.sectionTitleText}>Recent Activity</h2>
                {userPosts.length > 0 && (
                  <span className={styles.activityCountBadge}>{userPosts.length}</span>
                )}
              </div>
              <div className={styles.activityFeedList}>
                {userPosts.length === 0 ? (
                  <p className={styles.emptyDataMessage}>No recent activity shared.</p>
                ) : (
                  userPosts.map((post) => (
                    <div key={post._id} className={styles.activityFeedItem}>
                      {post.media && (
                        <div className={styles.postMediaWrapper}>
                          <img src={post.media} alt="Posted content" />
                        </div>
                      )}
                      <p className={styles.postBodyContent}>{post.body}</p>
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