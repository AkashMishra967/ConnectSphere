"use client";
import { Provider } from "react-redux";
import {store} from "@/src/config/redux/store";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}