"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/src/config/redux/reducer/authreducer";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NavBarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false);

  const goToProfile = () => {
    setMenuOpen(false);
    router.push("/profile");
  };

  const goToSettings = () => {
    setMenuOpen(false);
    router.push("/settings");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMenuOpen(false);
    router.push("/login");
    dispatch(reset());
  };

  return (
    <div className={styles.container}>

      {/* ================= DESKTOP / TOP NAVBAR ================= */}
      <nav className={styles.navBar}>

        {/* Logo */}
        <div
          className={styles.logo}
          onClick={() => router.push("/")}
        >
          <Image
            src="/images/image.png"
            alt="Pro Connect Logo"
            width={280}
            height={75}
            style={{
              width: "100%",
              height: "auto",
            }}
            priority
          />
        </div>

        {/* Desktop Options */}
        <div className={styles.navBarOptionContainer}>

          {authState.profileFetched && (
            <div className={styles.desktopOptions}>

              <p
                onClick={goToProfile}
                className={styles.desktopLink}
              >
                Profile
              </p>

              <p
                onClick={handleLogout}
                className={styles.desktopLink}
              >
                Logout
              </p>

            </div>
          )}

          {!authState.profileFetched && (
            <div
              onClick={() => router.push("/login")}
              className={styles.buttonJoin}
            >
              <p>Be a part</p>
            </div>
          )}

        </div>

        {/* ================= MOBILE TOP RIGHT MENU ================= */}

        {authState.profileFetched && (
          <div className={styles.mobileMenuWrapper}>

            <button
              className={styles.menuButton}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {menuOpen && (
              <>
                {/* Overlay */}
                <div
                  className={styles.menuOverlay}
                  onClick={() => setMenuOpen(false)}
                ></div>

                {/* Popup */}
                <div className={styles.mobileMenu}>

                  <div className={styles.menuUserInfo}>
                    <div className={styles.menuAvatar}>
                      {authState?.user?.userId?.profilePicture ? (
                        <img
                          src={authState.user.userId.profilePicture}
                          alt="Profile"
                        />
                      ) : (
                        <span>
                          {authState?.user?.userId?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4>
                        {authState?.user?.userId?.name || "User"}
                      </h4>

                      <p>
                        @{authState?.user?.userId?.username || "user"}
                      </p>
                    </div>
                  </div>

                  <div className={styles.menuDivider}></div>

                  {/* Profile */}
                  <button
                    className={styles.menuItem}
                    onClick={goToProfile}
                  >
                    <span className={styles.menuIcon}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.7"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0"
                        />
                      </svg>
                    </span>

                    <span>Profile</span>
                  </button>

                  {/* Settings */}
                  <button
                    className={styles.menuItem}
                    onClick={goToSettings}
                  >
                    <span className={styles.menuIcon}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.7"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6h3.75m6.75 6h6M3.75 12h7.5m3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 18h9.75m3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 18h3.75"
                        />
                      </svg>
                    </span>

                    <span>Settings</span>
                  </button>

                  <div className={styles.menuDivider}></div>

                  {/* Logout */}
                  <button
                    className={`${styles.menuItem} ${styles.logoutItem}`}
                    onClick={handleLogout}
                  >
                    <span className={styles.menuIcon}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.7"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3h-9"
                        />
                      </svg>
                    </span>

                    <span>Logout</span>
                  </button>

                </div>
              </>
            )}

          </div>
        )}

      </nav>


      {/* ================= MOBILE BOTTOM NAVBAR ================= */}

      {authState.profileFetched && (
        <div className={styles.mobileBottomNav}>

          {/* Home */}
          <button
            onClick={() => router.push("/dashboard")}
            className={styles.bottomNavItem}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.7"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.954a1.125 1.125 0 0 1 1.592 0L21.75 12M4.5 9.75V21h15V9.75M9 21v-6.75h6V21"
              />
            </svg>
          </button>


          {/* Search */}
          <button
            onClick={() => router.push("/search")}
            className={styles.bottomNavItem}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.7"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.04 6.04a7.5 7.5 0 0 0 10.61 10.61Z"
              />
            </svg>
          </button>


          {/* Connections */}
          <button
            onClick={() => router.push("/myconnection")}
            className={styles.bottomNavItem}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.7"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.3 9.3 0 0 0 2.25-.273V18a3 3 0 0 0-3-3h-1.125m-3.75 4.128a9.38 9.38 0 0 1-2.625.372 9.3 9.3 0 0 1-2.25-.273V18a3 3 0 0 1 3-3h1.125m0 0a3 3 0 1 0-6 0m6 0a3 3 0 1 1 6 0M12 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0Zm6 0a3 3 0 1 0-6 0"
              />
            </svg>
          </button>


          {/* PROFILE — Settings ki jagah */}
          <button
            onClick={goToProfile}
            className={`${styles.bottomNavItem} ${styles.profileBottomItem}`}
          >
            <div className={styles.bottomProfileIcon}>

              {authState?.user?.userId?.profilePicture ? (
                <img
                  src={authState.user.userId.profilePicture}
                  alt="Profile"
                />
              ) : (
                <span>
                  {authState?.user?.userId?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </span>
              )}

            </div>
          </button>

        </div>
      )}

    </div>
  );
}