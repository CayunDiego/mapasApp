import { useCallback, useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { v4 as uuidV4 } from 'uuid'
import { Subject } from 'rxjs'

mapboxgl.accessToken = 'pk.eyJ1IjoicGVyaWRpZWdvYzg5IiwiYSI6ImNsZDB6bTJidjE4N2UzdW9kOGdmMGFyMGUifQ._nbM8WabjC8s-wkasxHQRg'

const useMapBox = ( startPoint ) => {
  //Referencia al div del mapa
  const mapDiv = useRef()
  const setRef = useCallback( (nodo) => {
    mapDiv.current = nodo
  },[])

  //Referencia a los marcadores
  const markets = useRef({})

  //Observables de Rxjs
  const markerMovement$ = useRef( new Subject() ) //RXJS

  const newMarker$ = useRef( new Subject() ) //RXJS

  //Mapas y coors
  const map = useRef()
  const [ coors, setCoors ] = useState( startPoint )

  //Función para agregar marcadores
  const addMarket = useCallback( (ev, id) => {
    const { lng, lat } = ev.lngLat || ev
    const market = new mapboxgl.Marker()
    market.id = id ?? uuidV4()

    market
      .setLngLat([ lng, lat ])
      .addTo( map.current )
      .setDraggable( true )

    //Asignamos al objeto de marcadores
    markets.current[ market.id ] = market

    if ( !id ) {
      newMarker$.current.next({
        id: market.id,
        lng,
        lat
      })
    }

    //Escuchar movimientos del marcador
    market.on('drag', ({ target }) => {
      const { id } = target
      const { lng, lat } = target.getLngLat()
      markerMovement$.current.next({ id, lng, lat })
    })
  }, [])

  //Función para actualizar la ubicación del marcador
  const updatePosition = useCallback( ({ id, lng, lat }) => {
    markets.current[ id ].setLngLat([lng, lat])
  },[])

  useEffect(() => {
    const mapbox = new mapboxgl.Map({
      container: mapDiv.current, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [ startPoint.lng, startPoint.lat ], // starting position [lng, lat]
      zoom: startPoint.zoom, // starting zoom: ;
    })
    
    map.current = mapbox
  }, [])

  //Cuando se mueve el mapa
  useEffect(() => {
    map.current?.on('move', () => {
      const { lng, lat } = map.current.getCenter()
      setCoors({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.current.getZoom().toFixed(2)
      })
    })

    return () =>  map.current?.off('move')
  }, [])

  //Agregar marcadores cuando hago click
  useEffect(() => {
    map.current?.on('click', (ev) => {
      addMarket(ev)
    })
  }, [addMarket])
  

  return {
    addMarket,
    coors, 
    setRef,
    markets,
    newMarker$: newMarker$.current,
    markerMovement$: markerMovement$.current,
    updatePosition
  }
}

export default useMapBox