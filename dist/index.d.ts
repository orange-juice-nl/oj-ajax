export declare type Data = string | FormData | Document | Blob | ArrayBufferView | ArrayBuffer | URLSearchParams;
export interface IXHROptions {
    data?: Data;
    headers?: {
        [k: string]: string;
    };
    responseType?: XMLHttpRequestResponseType;
    progress?: (p: number) => void;
}
export declare const request: <T>(method: string, url: string, options?: IXHROptions) => Promise<T>;
export declare const get: <T>(url: string, options?: Omit<IXHROptions, "data">) => Promise<T>;
export declare const post: <T>(url: string, data: Data, options?: IXHROptions) => Promise<T>;
export declare const getJSON: <T>(url: string, options?: IXHROptions) => Promise<string | T>;
export declare const postJSON: <T extends Object = {}, I extends Object = {}>(url: string, data: I, options?: Omit<IXHROptions, "data">) => Promise<string | T>;
export declare const postForm: <T>(url: string, data: HTMLFormElement, options?: Omit<IXHROptions, "data">) => Promise<T>;
export declare const poll: <T>(url: string, rate: number, check: (res: T) => boolean) => Promise<T>;
