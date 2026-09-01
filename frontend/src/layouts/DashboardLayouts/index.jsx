"use client";

import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/src/config/redux/reducer/authreducer";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [showSettings, setShowSettings] = useState(false);

  const isProfilePage = pathname === "/profile";

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("token") === null) {
        router.push("/login");
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(reset());
    setShowSettings(false);
    router.push("/login");
  };

  const handleProfile = () => {
    setShowSettings(false);
    router.push("/profile");
  };

  const handleSettings = () => {
    setShowSettings(false);

    // Agar future me /settings page banega
    // to yahan direct route add kar sakte ho.
    router.push("/settings");
  };

  const profilePicture =
    authState?.user?.userId?.profilePicture || "";

  const profileName =
    authState?.user?.userId?.name || "User";

  const profileInitial =
    profileName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div>
      <div className="container">
        <div className={styles.homeContainer}>

          {/* ================= LEFT SIDEBAR ================= */}

          <div className={styles.homeContainer__leftBar}>
            <div>

              {/* HOME */}
              <div
                onClick={() => {
                  router.push("/dashboard");
                }}
                className={styles.sideBarOption}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>

                <p>Home</p>
              </div>

              {/* SEARCH */}
              <div
                onClick={() => {
                  router.push("/discover");
                }}
                className={styles.sideBarOption}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>

                <p>Search</p>
              </div>

              {/* CONNECTION */}
              <div
                onClick={() => {
                  router.push("/my-conections");
                }}
                className={styles.sideBarOption}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1-5.25 0Z"
                  />
                </svg>

                <p>My Connection</p>
              </div>

            </div>
          </div>

          {/* ================= MAIN FEED ================= */}

          <div className={styles.homeContainer__feedContainer}>
            {children}
          </div>

          {/* ================= TOP PROFILE ================= */}

          <div className={styles.homeContainer__extraContainer}>

            <h3 className={styles.extraContainer_heading}>
              Top Profile
            </h3>

            {authState.all_profiles_fetched &&
              authState.all_users
                .filter((profile) => profile.userId)
                .slice(0, 5)
                .map((profile) => {
                  return (
                    <div
                      key={profile._id}
                      className={styles.extraContainer_profile}
                      onClick={() =>
                        router.push(
                          `/view_profile/${profile.userId.username}`
                        )
                      }
                    >
                      {profile.userId.profilePicture ? (
                        <img
                          className={styles.extraContainer_profileImg}
                          src={profile.userId.profilePicture}
                          alt={profile.userId.name}
                        />
                      ) : (
                        <div
                          className={
                            styles.extraContainer_avatarPlaceholder
                          }
                        >
                          {profile.userId.name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div
                        className={styles.extraContainer_profileInfo}
                      >
                        <p
                          className={
                            styles.extraContainer_profileName
                          }
                        >
                          {profile.userId.name}
                        </p>

                        <p
                          className={
                            styles.extraContainer_profileUsername
                          }
                        >
                          @{profile.userId.username}
                        </p>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE PROFILE HEADER
          ONLY PROFILE PAGE
      ====================================================== */}

      {isProfilePage && (
        <div className={styles.mobileProfileHeader}>

          <div className={styles.mobileProfileHeaderTitle}>
            <span>My Profile</span>
          </div>

          <div className={styles.mobileProfileHeaderActions}>


            {/* THREE LINE BUTTON */}
            <button
              className={styles.mobileMenuButton}
              onClick={() =>
                setShowSettings(!showSettings)
              }
              aria-label="Open menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

          </div>

          {/* PROFILE MENU */}
          {showSettings && (
            <>
              <div
                className={styles.mobileMenuOverlay}
                onClick={() => setShowSettings(false)}
              ></div>

              <div className={styles.profileSettingsDropdown}>

                {/* USER INFO */}
                <div className={styles.profileMenuUser}>

                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt={profileName}
                      className={styles.profileMenuAvatar}
                    />
                  ) : (
                    <div
                      className={
                        styles.profileMenuAvatarPlaceholder
                      }
                    >
                      {profileInitial}
                    </div>
                  )}

                  <div>
                    <p className={styles.profileMenuName}>
                      {profileName}
                    </p>

                    <p className={styles.profileMenuUsername}>
                      @{authState?.user?.userId?.username || "user"}
                    </p>
                  </div>

                </div>

                <div className={styles.profileMenuDivider}></div>

                {/* PROFILE */}
                <div
                  className={styles.profileMenuItem}
                  onClick={handleProfile}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                    />
                  </svg>

                  <span>Profile</span>
                </div>

                {/* SETTINGS */}
                <div
                  className={styles.profileMenuItem}
                  onClick={handleSettings}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6h10.5M3 6h3m0 0a1.5 1.5 0 1 0 3 0m0 0h1.5M3 12h10.5m0 0H18m0 0a1.5 1.5 0 1 0 3 0m-3 0h-4.5M3 18h3m0 0a1.5 1.5 0 1 0 3 0m0 0h10.5"
                    />
                  </svg>

                  <span>Settings</span>
                </div>

                <div className={styles.profileMenuDivider}></div>

                {/* LOGOUT */}
                <div
                  className={`${styles.profileMenuItem} ${styles.profileMenuLogout}`}
                  onClick={handleLogout}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3-3H9m9 0-3-3m3 3-3 3"
                    />
                  </svg>

                  <span>Logout</span>
                </div>

              </div>
            </>
          )}
        </div>
      )}

      {/* ================= MOBILE NAVBAR ================= */}

      <div className={styles.mobileNavBar}>

        {/* HOME */}
        <div
          onClick={() => {
            router.push("/dashboard");
          }}
          className={styles.singleNavItemHolder_mobileView}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.7}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </div>

        {/* SEARCH */}
        <div
          onClick={() => {
            router.push("/discover");
          }}
          className={styles.singleNavItemHolder_mobileView}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.7}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>

        {/* CONNECTION */}
        <div
          onClick={() => {
            router.push("/my-conections");
          }}
          className={styles.singleNavItemHolder_mobileView}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.7}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766m7.874-9.75a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            />
          </svg>
        </div>

        {/* PROFILE ICON */}
        <div
          onClick={() => {
            router.push("/profile");
          }}
          className={`${styles.singleNavItemHolder_mobileView} ${
            isProfilePage ? styles.activeProfileNav : ""
          }`}
        >
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={profileName}
              className={styles.mobileProfileAvatar}
            />
          ) : (
            <div className={styles.mobileProfileAvatarPlaceholder}>
              {profileInitial}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}