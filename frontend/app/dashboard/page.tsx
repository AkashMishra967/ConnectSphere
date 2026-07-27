"use client"
import React from 'react';
import { useSelector } from 'react-redux';

function DashboardPage() {
  const authState = useSelector((state) => state.auth);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>
      <p>Welcome{authState?.username ? `, ${authState.username}` : ""}! You are logged in.</p>
    </div>
  );
}

export default DashboardPage;