"use client";

import React from "react";
import { AuthProvider } from "@/app/context/AuthContext";

export default function ContextWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
