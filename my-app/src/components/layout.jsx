import Sidebar from "./sidebar.component";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ display: "flex", flexGrow: 1 }}>
      <Sidebar />
      <div style={{ flex: 1, height: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
}
