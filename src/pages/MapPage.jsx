import { useContext, useEffect } from 'react'
import { SocketContext } from '../context/SocketContext'
import useMapBox from '../hooks/useMapBox'

const startPoint = {
  lng: -70.9229,
  lat: -46.5874,
  zoom: 13.5
}
const MapPage = () => {
  const { coors, setRef, newMarker$, markerMovement$, addMarket, updatePosition } = useMapBox( startPoint )
  const { socket } = useContext( SocketContext )

  //Nuevo marcador
  useEffect(() => {
    newMarker$.subscribe( marker => {
      socket.emit('new-marker', marker)
    })
  }, [newMarker$, socket])
  
  //Movimiento de marcador
  useEffect(() => {
    markerMovement$.subscribe( marker => {
      socket.emit('updated-marker', marker)
    })
  }, [socket, markerMovement$])

  //mover marcador mediante sockets
  useEffect(() => {
    socket.on('updated-marker', marker => {
      updatePosition( marker )
    })
  }, [socket, updatePosition])
  
  //escuchar nuevos marcadores
  useEffect(() => {
    socket.on('new-marker', ( marker ) => {
      addMarket( marker, marker.id )
    })
  }, [socket, addMarket])
  
  //escuchar los marcadores existentes
  useEffect(() => {
    socket.on('active-markers', ( markerList ) => {
      for( const key of Object.keys( markerList ) ) {
        addMarket( markerList[key], key )
      }
    })
  }, [socket, addMarket])
  
  
  return (
    <>
      <div className='info'>
        lng: { coors.lng } | lat: { coors.lat } | zoom: {  coors.zoom }
      </div>
      <div ref={ setRef } className='mapContainer'></div>
    </>
  )
}

export default MapPage