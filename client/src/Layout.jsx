import { Header } from "./components/Layout";
import { Outlet } from "react-router-dom";
import { LeftSideBar } from "./components/Layout";

function Layout({ children }){
    return (
        <>
            <Header/>
            <div className="flex gap-2 bg-gray-200 dark:bg-gray-950">
                <LeftSideBar />
                <div className="flex-1 bg-gray-200 dark:bg-gray-950">
                    {children ?? <Outlet />}
                </div>
            </div>
        </>
    )
}

export default Layout;
