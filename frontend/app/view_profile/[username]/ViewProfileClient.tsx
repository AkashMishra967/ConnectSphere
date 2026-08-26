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
          {/* Profile Cover */}
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={userProfile.userId.profilePicture}
              alt="profile"
            />
          </div>

          {/* Profile Details */}
          <div className={styles.profileContainer_details}>
            <div className={styles.profileContainer_flex}>
              <div style={{ flex: "0.8rem" }}>
                {/* Name and Username */}
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <h2>{userProfile.userId.name}</h2>

                  <p style={{ color: "gray" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>

                {/* Connection Buttons */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
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
                            <img src={post.media} alt='' />
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
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {work.company} - {work.position}
                    </p>

                    <p>{work.years}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </Userlayouts>
  );
}