import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "../ui/index.js";
import { Hamburger, SearchIcon, YoutubeLogo } from "../../assets/index.js";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import HeaderProfile from "./HeaderProfile.jsx";
import { toggleTheme } from "../../store/themeSlice.js";

function Header(){


    const authStatus = useSelector(state => state.auth.authStatus);
    const user = useSelector(state => state.auth.user)
    const theme = useSelector(state => state.theme.theme);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ profileClicked, setProfileClicked ] = useState(false);
    const [ searchQuery, setSearchQuery ] = useState("");

    const handleSearch = (event) => {
        event?.preventDefault?.();
        const trimmedQuery = searchQuery.trim();

        if (!trimmedQuery) return;

        navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    };

    return (
        <nav
        className={`sticky top-0 z-50 flex h-[10vh] w-full items-center justify-between overflow-visible px-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-gray-200 text-gray-950'} sm:px-6`}
        >
            <div
            className="flex h-10 w-50 items-center gap-2"
            >
                <span className="h-6 px-2 cursor-pointer">
                    <Hamburger />
                </span>
                <span className="h-6">
                    <Link to='/'>
                        <YoutubeLogo />
                    </Link>
                </span>

            </div>
            <form className="flex p-2" onSubmit={handleSearch}>
                <Input
                className={`h-10 w-[30vw] rounded-l-2xl border px-4 py-4 outline-none ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-950'}`}
                placeholder="Search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        handleSearch(event);
                    }
                }}
                />
                <Button
                className={`mt-1 h-10 rounded-r-4xl p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}
                type="submit"
                onClick={handleSearch}
                >
                    <SearchIcon />
                </Button>
            </form>
            <div className="flex items-center gap-3 mt-2">
                {
                    authStatus ? (
                        <div className="relative z-50 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => dispatch(toggleTheme())}
                                className={`rounded-full cursor-pointer border px-3 py-2 text-sm font-medium transition ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'}`}
                            >
                                Switch Theme to {theme === 'dark' ? 'Light' : 'Dark'}
                            </button>
                            <Button
                            className={`rounded-3xl px-4 transition-colors ${theme === 'dark' ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white text-gray-950 hover:bg-gray-100'}`}
                            >
                                <Link to="/upload-video"
                                className="flex items-center gap-1"
                                >
                                    <span className=" text-5xl mb-3">+</span> Upload Video
                                </Link>
                            </Button>
                            <Button
                            className={`mr-4 rounded-full border px-1 py-1 ${theme === 'dark' ? 'border-gray-700 bg-gray-950' : 'border-gray-300 bg-gray-200'}`}
                            onClick={() => setProfileClicked(!profileClicked)}
                            >
                                <img src={user?.avatar} alt="Avatar"
                                className="h-[8vh] w-[4vw] rounded-full object-cover"
                                />
                            </Button>
                            { profileClicked && <HeaderProfile user={user} /> }
                        </div>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => dispatch(toggleTheme())}
                                className={`rounded-full cursor-pointer border px-3 py-2 text-sm font-medium transition ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'}`}
                            >
                                Switch Theme: {theme === 'dark' ? 'Light' : 'Dark'}
                            </button>
                            <Link
                            to="/login"
                            className={`w-20 rounded-xl border px-1 py-3 text-center text-xl font-medium transition ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-950 hover:bg-gray-100'}`}
                            >
                                Login
                            </Link>
                            <Link
                            to="/register"
                            className={`w-20 rounded-xl border px-1 py-3 text-center text-xl font-medium transition ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700' : 'border-gray-300 bg-white text-gray-950 hover:bg-gray-100'}`}
                            >
                                Sign up
                            </Link>
                        </>
                    )
                }
            </div>
        </nav>
    )
}

export default Header;