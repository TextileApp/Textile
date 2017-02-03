export declare class DeviceAccounts {
    /**
     *  Gets all accounts registered on the Android Device
     * @returns {Promise<any>}
     */
    static get(): Promise<any>;
    /**
     *  Get all accounts registered on Android device for requested type
     * @returns {Promise<any>}
     */
    static getByType(type: string): Promise<any>;
    /**
     *  Get all emails registered on Android device (accounts with 'com.google' type)
     * @returns {Promise<any>}
     */
    static getEmails(): Promise<any>;
    /**
     *  Get the first email registered on Android device
     * @returns {Promise<any>}
     */
    static getEmail(): Promise<any>;
}
