/**
 * @name DeviceFeedback
 * @description
 *
 * Plugin that lets you provide haptic or acoustic feedback on Android devices.
 *
 * @usage
 * ```
 * import { DeviceFeedback } from 'ionic-native';
 *
 * DeviceFeedback.acoustic();
 *
 * DeviceFeedback.haptic(0);
 *
 * DeviceFeedback.isFeedbackEnabled()
 *   .then((feedback) => {
 *     console.log(feedback);
 *     // {
 *     //   acoustic: true,
 *     //   haptic: true
 *     // }
 *   });
 *
 * ```
 */
export declare class DeviceFeedback {
    /**
     * Provide sound feedback to user, nevertheless respect user's settings and current active device profile as native feedback do.
     */
    static acoustic(): void;
    /**
     * Provide vibrate feedback to user, nevertheless respect user's tactile feedback setting as native feedback do.
     * @param type {Number} Specify type of vibration feedback. 0 for long press, 1 for virtual key, or 3 for keyboard tap.
     */
    static haptic(type: number): void;
    /**
     * Check if haptic and acoustic feedback is enabled by user settings.
     * @returns {Promise<any>}
     */
    static isFeedbackEnabled(): Promise<{
        haptic: boolean;
        acoustic: boolean;
    }>;
}
