import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Header } from './components/Header.tsx'
import { App } from './routes/App.tsx'
import { PostPage } from './routes/PostPage.tsx'
import { Login } from './routes/Login.tsx'
import { Register } from './routes/Register.tsx'
import { Profile } from './routes/Profile.tsx'
import { About } from './routes/About.tsx'
import { SearchProvider } from './context/SearchContext.tsx'
import { AnswerProvider } from './context/AnswerContext.tsx'
import { ErrorPage } from './routes/ErrorPage.tsx'
import './index.css'

const queryClient = new QueryClient()

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <div className="flex flex-col h-screen-d">
        <Header />
        <App />
      </div>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/profile',
    element: (
      <div className="flex flex-col h-screen-d">
        <Header withoutSearchBar />
        <Profile />
      </div>
    ),
  },
  {
    path: '/about',
    element: (
      <div className="flex flex-col h-screen-d">
        <Header withoutSearchBar />
        <About />
      </div>
    ),
  },
  {
    path: '/:username/:postID',
    element: (
      <div className="flex flex-col h-screen-d">
        <Header />
        <PostPage />
      </div>
    ),
  },
]

const router = createBrowserRouter(appRoutes)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <AnswerProvider>
          <RouterProvider router={router} />
        </AnswerProvider>
      </SearchProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
