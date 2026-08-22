"use client"
import React, { useEffect } from 'react'
import DashboardLayout from "@/src/layouts/DashboardLayouts";
import Userlayouts from "@/src/layouts/userlayouts";
import { useDispatch, useSelector } from 'react-redux';
import styles from "./index.module.css";
import { AcceptConnection, getMyConnectionRequests } from '@/src/config/redux/action/authAction';
import { BASE_URL } from '@/src/config';
import { useRouter } from "next/navigation";

export default function MyConnectionPage() {

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth)
  const router = useRouter();

  useEffect(() => {
    dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
  }, [dispatch])

  const pendingRequests = authState.connectionRequest.filter((connection) => connection.status_accepted === null)
  const myConnections = authState.connectionRequest.filter((connection) => connection.status_accepted !== null)

  const handleAccept = (e, requestId) => {
    e.stopPropagation();
    dispatch(AcceptConnection({
      requestId: requestId,
      token: localStorage.getItem("token"),
      action: "accept",
    })).then(() => {
      dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
    })
  }

  return (
    <Userlayouts>
      <DashboardLayout>

        <div className={styles.pageContainer}>

          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>My Connections</h1>
            <p className={styles.pageSubtitle}>Manage your professional network</p>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Pending Requests
              {pendingRequests.length > 0 && <span className={styles.badge}>{pendingRequests.length}</span>}
            </h2>

            {pendingRequests.length === 0 ? (
              <p className={styles.emptyState}>No pending connection requests</p>
            ) : (
              <div className={styles.cardGrid}>
                {pendingRequests.map((user, index) => (
                  <div
                    onClick={() => router.push(`/view_profile/${user.userId.username}`)}
                    className={styles.userCard}
                    key={user._id || index}
                  >
                    <div className={styles.profilePicture}>
                      {user.userId.profilePicture ? (
                        <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt={user.userId.name} />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          {user.userId.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p>@{user.userId.username}</p>
                    </div>
                    <button
                      className={styles.acceptButton}
                      onClick={(e) => handleAccept(e, user._id)}
                    >
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>My Network</h2>

            {myConnections.length === 0 ? (
              <p className={styles.emptyState}>You haven't connected with anyone yet</p>
            ) : (
              <div className={styles.cardGrid}>
                {myConnections.map((user, index) => (
                  <div
                    onClick={() => router.push(`/view_profile/${user.userId.username}`)}
                    className={styles.userCard}
                    key={user._id || index}
                  >
                    <div className={styles.profilePicture}>
                      {user.userId.profilePicture ? (
                        <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt={user.userId.name} />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          {user.userId.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p>@{user.userId.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

      </DashboardLayout>
    </Userlayouts>
  )
}
