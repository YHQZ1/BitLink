import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header.jsx'

const AppLayout = () => {
  return (
    <div>
      <main className='min-h-screen px-4 sm:px-8 lg:px-16'>
        <Header />
        <Outlet />
      </main>
      <footer className='p-10 text-center bg-gray-800 mt-10'>
        BitLink
      </footer>
    </div>
  )
}

export default AppLayout

