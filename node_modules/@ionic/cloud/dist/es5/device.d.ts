import { Device as NativeDevice } from 'ionic-native';
import { DeviceDependencies, DeviceIsConnectedToNetworkOptions, IDevice } from './definitions';
/**
 * @hidden
 */
export declare class Device implements IDevice {
    deps: DeviceDependencies;
    native: typeof NativeDevice;
    type: string;
    /**
     * @private
     */
    private emitter;
    constructor(deps: DeviceDependencies);
    isAndroid(): boolean;
    isIOS(): boolean;
    isConnectedToNetwork(options?: DeviceIsConnectedToNetworkOptions): boolean;
    /**
     * @private
     */
    private registerEventHandlers();
    /**
     * @private
     */
    private determineDeviceType();
}
