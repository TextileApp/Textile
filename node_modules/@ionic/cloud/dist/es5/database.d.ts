import { DBDependencies } from './definitions';
import { IonicDB, IonicDBOptions } from '@ionic/db';
export declare class Database extends IonicDB {
    private deps;
    private settings;
    _digest: Function;
    constructor(deps: DBDependencies, settings: IonicDBOptions);
}
