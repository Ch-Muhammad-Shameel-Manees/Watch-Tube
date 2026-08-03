import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router';
import { setTheme } from './store/themeSlice.js';

function App() {
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.theme);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        dispatch(setTheme(savedTheme));
    }, [dispatch]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.style.backgroundColor = theme === 'dark' ? '#111827' : '#f3f4f6';
        document.body.style.backgroundColor = theme === 'dark' ? '#111827' : '#f3f4f6';
        document.body.style.color = theme === 'dark' ? '#e5e7eb' : '#111827';
    }, [theme]);

    return (
        <div className={`${theme === 'dark' ? 'bg-gray-950 text-gray-200' : 'bg-gray-200 text-gray-950'}`}>
            <Outlet />
        </div>
    )
}

export default App
