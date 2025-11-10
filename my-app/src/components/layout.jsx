import Sidebar from "./sidebar.component";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ display: "flex", flexGrow: 1 }}>
      <Sidebar />
      <div className="content" style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}
