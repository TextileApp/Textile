import { Observable } from 'rxjs';

export interface Feed {
    watch (options?: { rawChanges: boolean }): Observable<any>;
    fetch (): Observable<any>;
}

export type Bound = 'open' | 'closed';
export type Id = string | { id: string, [key:string]: any };
export type ReadOp = Id | Object;
export type WriteOp = Object | Object[];

export interface TermBase extends Feed {
    find (value: ReadOp): TermBase;
    findAll (...values: ReadOp[]): TermBase;

    order (...fields: string[]): TermBase;
    limit (size: Number): TermBase;
    above (spec: any, bound?: Bound): TermBase;
    below (spec: any, bound?: Bound): TermBase;
}

export interface Collection extends TermBase {
    store (docs: WriteOp): Observable<any>;
    upsert (docs: WriteOp): Observable<any>;
    insert (docs: WriteOp): Observable<any>;
    replace (docs: WriteOp): Observable<any>;
    update (docs: WriteOp): Observable<any>;

    remove (docs: Id): Observable<any>;
    removeAll (docs: Id[]): Observable<any>;
}

export interface User extends Feed {}


export interface IonicDBOptions {
    host?: string;
    path?: string;
    app_id?: string;
    secure?: boolean;

    authType?: "authenticated" | "unauthenticated";
    lazyWrites?: boolean;
    keepalive?: number;
    retry?: number;

    WebSocketCtor?: any;
}

export declare class IonicDB {
  constructor(settings: IonicDBOptions)
  collection(name: string): Collection;

  currentUser (): User;

  aggregate (aggs: any): Feed;
  model (fn: Function): Function;

  disconnect (): void;
  connect (): void;

  status (): Observable<any>;
  onConnected (): Observable<any>;
  onDisconnected (): Observable<any>;
  onSocketError (): Observable<any>;
  onReconnecting (): Observable<any>;
  setToken (token: string): void;
  removeToken (): void;
}
