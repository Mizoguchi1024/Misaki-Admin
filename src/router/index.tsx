import AuthLayout from '@/components/layout/AuthLayout'
import MainLayout from '@/components/layout/MainLayout'
import Assistant from '@/pages/Assistant'
import Chat from '@/pages/Chat'
import Feedback from '@/pages/Feedback'
import Log from '@/pages/Log'
import Login from '@/pages/Login'
import Mcp from '@/pages/Mcp'
import Model from '@/pages/Model'
import NotFound from '@/pages/NotFound'
import User from '@/pages/User'
import Workspace from '@/pages/Workspace'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/workspace', element: <Workspace />, handle: { page: 'workspace' } },
      { path: '/mcp', element: <Mcp />, handle: { page: 'mcp' } },
      { path: '/user', element: <User />, handle: { page: 'user' } },
      { path: '/assistant', element: <Assistant />, handle: { page: 'assistant' } },
      { path: '/model', element: <Model />, handle: { page: 'model' } },
      { path: '/chat', element: <Chat />, handle: { page: 'chat' } },
      { path: '/feedback', element: <Feedback />, handle: { page: 'feedback' } },
      { path: '/log', element: <Log />, handle: { page: 'log' } }
    ]
  },
  {
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login />, handle: { page: 'login' } },
      // { path: '/reset-password', element: <ResetPassword />, handle: { page: 'reset-password' } },
      { path: '*', element: <NotFound />, handle: { page: 'not-found' } }
    ]
  }
])
