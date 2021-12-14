import { Component } from './components';

export default interface Device {
  deviceId: string;
  presentationId: string;
  manufacturerName: string;
  type: 'BLE' | 'BLE_D2D' | 'DTH' | 'ENDPOINT_APP' | 'HUB' | 'IR' | 'IR_OCF' | 'MQTT' | 'OCF' | 'PENGYOU' | 'VIDEO' | 'VIPER' | 'WATCH' | 'GROUP' | 'LAN' | 'ZIGBEE' | 'ZWAVE';
  restrictionTier: string;
  name: string;
  label?: string;
  deviceManufacturerCode?: string;
  locationId?:string;
  ownerId?:string;
  components: Component[];
}