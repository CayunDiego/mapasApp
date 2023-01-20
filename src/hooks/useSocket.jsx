import { useMemo, useState, useEffect } from 'react'
import io from 'socket.io-client'

export const useSocket = ( serverPath ) => {
  
  //useMemo para que no se ejecute tantas veces el io.connetc
  const socket = useMemo( () => io.connect( serverPath, {
    transports: ['websocket']
  }), [ serverPath ])
  
  const [ online, setOnline ] = useState(false)

  useEffect(() => {
    setOnline( socket.connected )
  }, [ socket ])

  useEffect(() => {
    socket.on( 'connect', () => {
      setOnline(true)
    })
  }, [ socket ])

  useEffect(() => {
    socket.on( 'disconnect', () => {
      setOnline(false)
    })
  }, [ socket ])


  return {
    socket, 
    online
  }
}
