/**
 * @name FilePath
 * @description
 *
 * This plugin allows you to resolve the native filesystem path for Android content URIs and is based on code in the aFileChooser library.
 *
 * @usage
 * ```
 * import {FilePath} from 'ionic-native';
 *
 * FilePath.resolveNativePath(path)
 *   .then(filePath => console.log(filePath);
 *   .catch(err => console.log(err);
 *
 * ```
 */
export declare class FilePath {
    /**
     * Resolve native path for given content URL/path.
     * @param {String} path  Content URL/path.
     * @returns {Promise<string>}
     */
    static resolveNativePath(path: string): Promise<string>;
}
