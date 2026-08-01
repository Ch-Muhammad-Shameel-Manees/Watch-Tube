import { Header } from "./components/Layout";
import { Outlet } from "react-router";
import { LeftSideBar } from "./components/Layout";

function Layout(){
    return (
        <>
            <Header/>
            <div className="flex gap-2 bg-gray-200 dark:bg-gray-950">
                <LeftSideBar />
                <div className="flex-1 bg-gray-200 dark:bg-gray-950">
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Layout;
