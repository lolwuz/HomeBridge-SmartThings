import axios from './samsung/axios';
import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { ExampleHomebridgePlatform } from './platform';

const dryerStates = [
  'cooling',
  'delayWash',
  'drying',
  'finished',
  'none',
  'refreshing',
  'weightSensing',
  'wrinklePrevent',
  'dehumidifying',
  'aIDrying',
  'sanitizing',
  'internalCare',
  'pause',
  'run',
  'stop',
];

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class ExamplePlatformAccessory {
  /**
   * These are just used to create a working example
   * You should implement your own code to track the state of your accessory
   */
  private state = {
    Brightness: 100,
    On: false,
  };

  private dryerOperatingState = {
    ContactSensorState: false,
  };

  private machineState = {
    pause: false,
    run: false,
    stop: false,
    cooling: false,
    delayWash: false,
    drying: false,
    finished: false,
    none: false,
    refreshing: false,
    weightSensing: false,
    wrinklePrevent: false,
    dehumidifying: false,
    aIDrying: false,
    sanitizing: false,
    internalCar: false,
  };

  constructor(
    private readonly platform: ExampleHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Default-Manufacturer')
      .setCharacteristic(this.platform.Characteristic.Model, 'Default-Model')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial');

    dryerStates.forEach(state => {
      const name = state.toUpperCase();

      this.platform.log.debug(name);

      // add service
      const service = this.accessory.getService(name) ||
        this.accessory.addService(this.platform.Service.ContactSensor, name, name);

      // set name
      service.setCharacteristic(this.platform.Characteristic.Name, name);

      // register handlers for the On/Off Characteristic
      service.getCharacteristic(this.platform.Characteristic.ContactSensorState)
        .onGet(this.getContactSensorState.bind(this, state));
    });

    this.platform.log.debug('starting interval');
    // update dryer state
    setInterval(this.updateDryerOperatingState.bind(this), 10 * 1000);
  }

  /**
   * update the operating state for the dryer
   * https://developer-preview.smartthings.com/capabilities/dryerOperatingState
   */
  async updateDryerOperatingState() {
    this.platform.log.debug('updating state');
    // fetch status
    const { data } = await axios.get(
      `/devices/${this.accessory.context.device.deviceId}/components/main/capabilities/dryerOperatingState/status`,
    );

    const { machineState, dryerJobState } = data;
    // reset all states
    dryerStates.forEach(value => {
      this.machineState[value] = false;
    });

    this.machineState[machineState.value] = true;

    this.platform.log.debug(this.machineState.stop.toString());

    this.platform.log.debug(data);
  }

  /**
   * Handle the "GET" requests from HomeKit
   */
  async getContactSensorState(value: string): Promise<CharacteristicValue> {
    this.platform.log.debug('Dryer On: ', this.machineState[value]);

    // return unint instead of boolean
    return this.machineState[value] ? 1 : 0;
  }
}
