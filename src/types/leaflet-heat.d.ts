import * as L from 'leaflet';

declare module 'leaflet' {
  export function heatLayer(
    latlngs: Array<[number, number, number?]> | Array<L.LatLng>,
    options?: HeatLayerOptions
  ): L.Layer;

  interface HeatLayerOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: { [key: number]: string };
  }
}