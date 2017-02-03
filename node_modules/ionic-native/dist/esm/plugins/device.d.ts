/**
 * @name Device
 * @description
 * Access information about the underlying device and platform.
 *
 * @usage
 * ```typescript
 * import { Device } from 'ionic-native';
 *
 *
 * console.log('Device UUID is: ' + Device.uuid);
 * ```
 */
export declare class Device {
    /** Get the version of Cordova running on the device. */
    static cordova: string;
    /**
     * The device.model returns the name of the device's model or product. The value is set
     * by the device manufacturer and may be different across versions of the same product.
     */
    static model: string;
    /** Get the device's operating system name. */
    static platform: string;
    /** Get the device's Universally Unique Identifier (UUID). */
    static uuid: string;
    /** Get the operating system version. */
    static version: string;
    /** Get the device's manufacturer. */
    static manufacturer: string;
    /** Whether the device is running on a simulator. */
    static isVirtual: boolean;
    /** Get the device hardware serial number. */
    static serial: string;
}
