import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { createBrowserRouter, createRoutesFromElements ,Route,RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {RegisterUser, LoginUser} from './components/User';
import { UploadVideo, GetAllVideos, PlayVideo, WatchHistory} from './components/Video'
import { AuthProvider, ProtectedRoute, Dashboard, SearchResults } from './components'
import { GetChannelVideos, SubscribedChannels, ChannelProfile  } from './components/Channel'
import { UserPlaylists, PlaylistPage, CreatePlaylist } from './components/Playlist'

const queryClient = new QueryClient()

const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<AuthProvider />}>
          <Route path='/' element={<App />}>
            <Route path='/' element={<Dashboard />} />
            <Route element={<ProtectedRoute />}>
              <Route path='upload-video' element={<UploadVideo />} />
              <Route path='watch-history' element={<WatchHistory />} />
              <Route path='playlists' element={<UserPlaylists />} />
              <Route path='playlists/create' element={<CreatePlaylist />} />
              <Route path='playlists/:playlistId' element={<PlaylistPage />} />
            </Route>
            <Route path='channel/:username' element={<ChannelProfile />} />
            <Route path='video/:videoId' element={<PlayVideo />} />
            <Route path='search' element={<SearchResults />} />
          </Route>
        </Route>
        <Route path='/login' element={<LoginUser />} />
        <Route path='register' element={<RegisterUser />} />
      </>
    )
)

createRoot(document.getElementById('root')).render(

    <QueryClientProvider client={queryClient}> 
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>

)
