export declare type Data = string | FormData | Document | Blob | ArrayBufferView | ArrayBuffer | URLSearchParams;
export declare const requestRaw: (method: string, url: string, data?: Data, contentType?: string, responseType?: string, progress?: (p: number) => void) => Promise<XMLHttpRequest>;
export declare const request: <T>(method: string, url: string, data?: Data, contentType?: string, responseType?: string, progress?: (p: number) => void) => Promise<T>;
export declare const get: <T>(url: string, options?: {
    contentType?: string;
    responseType?: string;
    progress?: (p: number) => void;
}) => Promise<T>;
export declare const post: <T>(url: string, data: Data, options?: {
    contentType?: string;
    responseType?: string;
    progress?: (p: number) => void;
}) => Promise<T>;
export declare const getJSON: <T>(url: string, options?: {
    progress?: (p: number) => void;
}) => Promise<T>;
export declare const postJSON: <T extends Object>(url: string, data: T, options?: {
    progress?: (p: number) => void;
}) => Promise<any>;
export declare const postForm: (url: string, data: HTMLFormElement, options?: {
    progress?: (p: number) => void;
}) => Promise<unknown>;
export declare const poll: <T>(url: string, rate: number, check: (res: T) => boolean) => Promise<T>;
