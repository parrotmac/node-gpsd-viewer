import React from 'react';
import './App.css';
import MapViewer, { ILatLng } from './MapViewerComponent';
import WebsocketWrapper from './WebsocketWrapper';
import {
  Viewport
} from "react-leaflet";

interface AppState {
  position: ILatLng;
  useDefaultViewport: boolean;
  viewport: Viewport;
  deviceName: string
}

interface TPVReport {
  class: string
  tag: string
  device: string
  mode: object
  time: Date
  ept: number
  lat: number
  lon: number
  alt: number
  epx: number
  epy: number
  epv: number
  track: number
  speed: number
  climb: number
  epd: number
  eps: number
  epc: number
}

interface Satellite {
  PRN: number
  az: number
  el: number
  ss: number
  used: boolean
}

interface SKYReport {
  class: string
  tag: string
  device: string
  time: Date
  xdop: number
  ydop: number
  vdop: number
  tdop: number
  hdop: number
  pdop: number
  gdop: number
  satellites: Array<Satellite>
}

const initialViewport: Viewport = {
  center: [0, 0],
  zoom: 15
}


class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      position: {
        lat: 0,
        lng: 0
      },
      useDefaultViewport: true,
      viewport: initialViewport,
      deviceName: "Unknown"
    };
  }

  maybeUpdateStatePosition = (data: string) => {
    const satelliteData = JSON.parse(data) as SKYReport | TPVReport;
    switch (satelliteData.class) {
      case "TPV":
        const { lat, lon } = satelliteData as TPVReport
        const newPosition: ILatLng = {
          lat: lat,
          lng: lon,
        };
        this.setState({
          position: newPosition,
        });
        break;
      case "SKY":
        const { device } = satelliteData as SKYReport; // Also present in TPV
        this.setState({
          deviceName: device,
        });
        break;
      default:
        console.warn("unrecognized data", satelliteData);
    }
  }

  onViewportUpdated = (viewport: Viewport) => {
    this.setState({
      useDefaultViewport: false,
      viewport: viewport,
    })
  }

  public render(): JSX.Element {
    console.log(this.state.position);
    const { position, useDefaultViewport, viewport, deviceName } = this.state;
    let targetViewport: Viewport | undefined = undefined;
    if (useDefaultViewport) {
      targetViewport = {
        center: [position.lat, position.lng],
        zoom: initialViewport.zoom,
      }
    }

    return (
      <div className="App">
        <MapViewer
          markers={[
            {
              position: this.state.position,
              text: deviceName,
            },
          ]}
          viewport={targetViewport}
          onViewportChange={this.onViewportUpdated}
        />
        <WebsocketWrapper
          url={"ws://localhost:8080"}
          onMessage={this.maybeUpdateStatePosition}
        />
      </div>
    );
  }
}

export default App;
