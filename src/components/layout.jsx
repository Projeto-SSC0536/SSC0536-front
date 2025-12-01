import Sidebar from "./sidebar.component";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ display: "flex", height: "calc(100% - 40px)", width: "calc(100% - 220px)", marginLeft: "220px", marginTop: "40px"}}>
      <Sidebar />
      <div >
        <Outlet />
      </div>
    </div>
  );
}
