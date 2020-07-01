import React, { useState, useEffect } from 'react'
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react'
import { map, forEach, pathOr } from 'ramda'
import { Button } from '@material-ui/core'
import {
  getTable,
  getData,
  getActions,
  getWithAddressLatLon,
} from '../table/helpers/get-table-data'
import { Row, Col } from '../../components/layouts'
import ListItem from './list_item'

const MapList = ({ currentSearch, setViewing, viewing, downloadLink, google }) => {
  const [loadingPage, setLoadingPage] = useState(true)
  const [dataPoints, setDataPoints] = useState([])

  const table = getTable(currentSearch)
  const data = getData(table)
  const actions = getActions(table)

  var bounds = new google.maps.LatLngBounds()

  forEach(point => {
    const { lat, lng } = pathOr({}, ['geometry', 'location'], point)
    bounds.extend({ lat: lat(), lng: lng() })
  }, dataPoints)

  useEffect(() => {
    setLoadingPage(true)
    getWithAddressLatLon({ data, setDataPoints, setLoadingPage })
  }, [])

  const markers = map(({ PRI_NAME, PRI_ASSOC_HC, geometry: { location: { lat, lng } } }) => (
    <Marker
      key={PRI_NAME + 'marker'}
      title={PRI_NAME}
      name={PRI_ASSOC_HC}
      position={{ lat: lat(), lng: lng() }}
    />
  ))(dataPoints)

  return (
    <Col left top>
      <Button onClick={() => setViewing(viewing => ({ ...viewing, view: 'TABLE' }))}>
        {`Table View`}
      </Button>
      <Row left top>
        <Col stretch>
          {map(item => (
            <ListItem
              key={'item' + item.PRI_NAME}
              {...item}
              setViewing={setViewing}
              actions={actions}
            />
          ))(dataPoints)}
        </Col>
        <Map
          google={google}
          zoom={14}
          initialCenter={{
            lat: -37.8136,
            lng: 144.9631,
          }}
          containerStyle={{
            width: '70%',
            height: '75%',
          }}
          bounds={bounds}
        >
          {markers}
        </Map>
      </Row>
    </Col>
  )
}

export default GoogleApiWrapper(({ apiKey }) => ({ apiKey }))(MapList)