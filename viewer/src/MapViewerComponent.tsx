import React, { Component } from "react";
import {
    Map,
    TileLayer,
    Marker,
    Popup,
    Viewport
} from "react-leaflet";
import { LatLngExpression } from "leaflet";


const MyPopupMarker = ({ text, position }: IPopupMarkerParams) => (
    <Marker position={[position.lat, position.lng]}>
        <Popup>
            <span>{text}</span>
        </Popup>
    </Marker>
);
interface IPopupMarkerParams {
    text: string
    position: ILatLng
};

const MyMarkersList = ({ markers }: IMarkersListParams) => {
    const items = markers.map(({ key, ...props }) => (
        <MyPopupMarker key={key} {...props} />
    ));
    return <div style={{ display: "none" }}>{items}</div>;
};
interface IMarkersListParams {
    markers: Array<IKeyedMarker>
}

export interface ILatLng {
    lat: number
    lng: number
}

export interface IMarker {
    position: ILatLng
    text: string
}

export interface IKeyedMarker extends IMarker {
    key: string
}

export interface IMapViewerProps {
    viewport?: Viewport
    markers: Array<IMarker>
    onViewportChange: (viewport: Viewport) => void
}

export default class MapViewer extends Component<IMapViewerProps> {
    render() {
        const { markers, onViewportChange, viewport } = this.props;

        const keyedMarkers = markers.map((mkr, idx) => {
            return {
                key: `marker-${idx}`, // Technically bad :)
                text: mkr.text,
                position: mkr.position,
            }
        });
        return (
            <Map
                viewport={viewport}
                onViewportChange={this.props.onViewportChange}
            >
                <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />
                <MyMarkersList markers={keyedMarkers} />
            </Map>
        );
    }
}
