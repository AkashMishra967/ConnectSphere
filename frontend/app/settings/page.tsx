"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./index.module.css";

export default function SettingsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] =
    useState(true);
  const [privateProfile, setPrivateProfile] =
    useState(false);

  return (
    <div className={styles.page}>
      {/* HEADER */}

      <div className={styles.header}>
        <button
          onClick={() => router.back()}
          className={styles.backButton}
          aria-label="Go back"
        >
          ←
        </button>

        <div>
          <h1 className={styles.title}>Settings</h1>

          <p className={styles.subtitle}>
            Manage your application preferences
          </p>
        </div>
      </div>

      {/* GENERAL SETTINGS */}

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>General</h2>

        <p className={styles.cardDescription}>
          Control how the application works for you.
        </p>

        {/* NOTIFICATIONS */}

        <div className={styles.row}>
          <div>
            <h3 className={styles.rowTitle}>Notifications</h3>

            <p className={styles.rowHint}>
              Receive notifications about new activity.
            </p>
          </div>

          <input
            type="checkbox"
            className={styles.switch}
            checked={notifications}
            onChange={(e) =>
              setNotifications(e.target.checked)
            }
          />
        </div>

        {/* EMAIL NOTIFICATIONS */}

        <div className={styles.row}>
          <div>
            <h3 className={styles.rowTitle}>Email Notifications</h3>

            <p className={styles.rowHint}>
              Receive important updates through email.
            </p>
          </div>

          <input
            type="checkbox"
            className={styles.switch}
            checked={emailNotifications}
            onChange={(e) =>
              setEmailNotifications(e.target.checked)
            }
          />
        </div>

        {/* PRIVATE PROFILE */}

        <div className={styles.row}>
          <div>
            <h3 className={styles.rowTitle}>Private Profile</h3>

            <p className={styles.rowHint}>
              Limit who can view your profile.
            </p>
          </div>

          <input
            type="checkbox"
            className={styles.switch}
            checked={privateProfile}
            onChange={(e) =>
              setPrivateProfile(e.target.checked)
            }
          />
        </div>
      </div>

      {/* APPEARANCE */}

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Appearance</h2>

        <p className={styles.cardDescription}>
          Customize how the application looks.
        </p>

        <div className={styles.row}>
          <div>
            <h3 className={styles.rowTitle}>Theme</h3>

            <p className={styles.rowHint}>
              Choose your preferred application theme.
            </p>
          </div>

          <select className={styles.select}>
            <option>Light</option>
            <option>Dark</option>
            <option>System Default</option>
          </select>
        </div>
      </div>

      {/* ABOUT APP */}

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>About</h2>

        <p className={styles.cardDescription}>
          Information about the application.
        </p>

        <div className={styles.infoRow}>
          <span>Application</span>
          <span className={styles.infoValue}>ConnectSphere</span>
        </div>

        <div className={styles.infoRow}>
          <span>Version</span>
          <span className={styles.infoValue}>1.0.0</span>
        </div>
      </div>
    </div>
  );
}
