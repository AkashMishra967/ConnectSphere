"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const authState = useSelector((state: any) => state.auth);

  const user = authState?.user?.userId;

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(
    user?.username || ""
  );

  const handleSave = () => {
    console.log("Name:", name);
    console.log("Username:", username);

    alert("Basic information updated!");
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            border: "none",
            background: "#f1f5f9",
            padding: "10px 15px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <h1 style={{ margin: 0 }}>
          Settings
        </h1>
      </div>

      {/* BASIC INFORMATION */}

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "15px",
          padding: "25px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.05)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "5px",
          }}
        >
          Basic Information
        </h2>

        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
            marginBottom: "25px",
          }}
        >
          Update your basic profile information.
        </p>

        {/* NAME */}

        <div style={{ marginBottom: "18px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "600",
            }}
          >
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Enter your name"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              outline: "none",
            }}
          />
        </div>

        {/* USERNAME */}

        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "600",
            }}
          >
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            placeholder="Enter username"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              border:
                "1px solid #d1d5db",
              borderRadius: "8px",
              outline: "none",
            }}
          />
        </div>

        {/* SAVE */}

        <button
          onClick={handleSave}
          style={{
            border: "none",
            background: "#2563eb",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}