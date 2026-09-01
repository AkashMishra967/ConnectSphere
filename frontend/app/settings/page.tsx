"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] =
    useState(true);
  const [privateProfile, setPrivateProfile] =
    useState(false);

  return (
    <div
      style={{
        maxWidth: "850px",
        margin: "0 auto",
        padding: "30px 20px 80px",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            border: "none",
            background: "#f1f5f9",
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ←
        </button>

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "26px",
              color: "#111827",
            }}
          >
            Settings
          </h1>

          <p
            style={{
              margin: "5px 0 0",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Manage your application preferences
          </p>
        </div>
      </div>

      {/* GENERAL SETTINGS */}

      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            margin: "0 0 5px",
            fontSize: "18px",
            color: "#111827",
          }}
        >
          General
        </h2>

        <p
          style={{
            margin: "0 0 20px",
            fontSize: "13px",
            color: "#94a3b8",
          }}
        >
          Control how the application works for you.
        </p>

        {/* NOTIFICATIONS */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <div>
            <h3
              style={{
                margin: "0 0 5px",
                fontSize: "15px",
              }}
            >
              Notifications
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              Receive notifications about new activity.
            </p>
          </div>

          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) =>
              setNotifications(e.target.checked)
            }
          />
        </div>

        {/* EMAIL NOTIFICATIONS */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <div>
            <h3
              style={{
                margin: "0 0 5px",
                fontSize: "15px",
              }}
            >
              Email Notifications
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              Receive important updates through email.
            </p>
          </div>

          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) =>
              setEmailNotifications(e.target.checked)
            }
          />
        </div>

        {/* PRIVATE PROFILE */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
          }}
        >
          <div>
            <h3
              style={{
                margin: "0 0 5px",
                fontSize: "15px",
              }}
            >
              Private Profile
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              Limit who can view your profile.
            </p>
          </div>

          <input
            type="checkbox"
            checked={privateProfile}
            onChange={(e) =>
              setPrivateProfile(e.target.checked)
            }
          />
        </div>
      </div>

      {/* APPEARANCE */}

      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            margin: "0 0 5px",
            fontSize: "18px",
            color: "#111827",
          }}
        >
          Appearance
        </h2>

        <p
          style={{
            margin: "0 0 20px",
            fontSize: "13px",
            color: "#94a3b8",
          }}
        >
          Customize how the application looks.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3
              style={{
                margin: "0 0 5px",
                fontSize: "15px",
              }}
            >
              Theme
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              Choose your preferred application theme.
            </p>
          </div>

          <select
            style={{
              padding: "9px 12px",
              border: "1px solid #dbe3ec",
              borderRadius: "8px",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <option>Light</option>
            <option>Dark</option>
            <option>System Default</option>
          </select>
        </div>
      </div>

      {/* ABOUT APP */}

      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <h2
          style={{
            margin: "0 0 5px",
            fontSize: "18px",
            color: "#111827",
          }}
        >
          About
        </h2>

        <p
          style={{
            margin: "0 0 18px",
            fontSize: "13px",
            color: "#94a3b8",
          }}
        >
          Information about the application.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <span>Application</span>
          <span style={{ color: "#64748b" }}>
            ConnectSphere
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
          }}
        >
          <span>Version</span>
          <span style={{ color: "#64748b" }}>
            1.0.0
          </span>
        </div>
      </div>
    </div>
  );
}