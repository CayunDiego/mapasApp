import React from 'react'
import { SocketProvider } from './context/SocketContext'
import MapPage from './pages/MapPage'

const MapsApp = () => {
  return (
    <SocketProvider>
      <MapPage/>
    </SocketProvider>
  )
}

export default MapsApp