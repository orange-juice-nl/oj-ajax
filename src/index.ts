export type Data = string | FormData | Document | Blob | ArrayBufferView | ArrayBuffer | URLSearchParams
export interface IXHROptions {
  data?: Data,
  headers?: { [k: string]: string },
  responseType?: XMLHttpRequestResponseType,
  progress?: (p: number) => void
}

const requestRaw = (method: string, url: string, options: IXHROptions = {}) =>
  new Promise<XMLHttpRequest>((res, rej) => {
    let upProgress = 0
    let downProgress = 0
    const emitProgress = () => typeof options.progress === "function" && options.progress((upProgress + downProgress) * .5)

    const xhr = new XMLHttpRequest()
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) res(xhr)
      else rej(xhr)
    }
    if (typeof options.progress === "function") {
      if (xhr.upload) xhr.upload.onprogress = e => { upProgress = Math.ceil((e.loaded / e.total) * 100); emitProgress() }
      xhr.onprogress = e => { downProgress = Math.ceil((e.loaded / e.total) * 100); emitProgress() }
    }
    xhr.onerror = () => rej(xhr)
    xhr.open(method, url, true)
    if (options.responseType)
      xhr.responseType = options.responseType
    if (options.headers)
      Object.keys(options.headers).forEach(k =>
        xhr.setRequestHeader(k, options.headers[k]))
    xhr.send(options.data)
  })

export const request = <T>(method: string, url: string, options: IXHROptions = {}): Promise<T> =>
  requestRaw(method, url, options)
    .then(xhr => xhr.response || xhr.responseText)
    .catch(xhr => ({ status: xhr.status, statusText: xhr.statusText }))

export const get = <T>(url: string, options: Omit<IXHROptions, "data"> = {}) =>
  request<T>("GET", url, options)

export const post = <T>(url: string, data: Data, options: IXHROptions = {}) =>
  request<T>("POST", url, { ...options, data })

export const getJSON = async <T>(url: string, options: IXHROptions = {}) : Promise<T | string> => {
  const r = await get<string>(url, { ...options, headers: { ...(options.headers || {}), "Content-Type": "application/json;charset=UTF-8" } })
  try {
    return JSON.parse(r)
  } catch (err) {
    return r
  }
}

export const postJSON = async <T extends Object, I extends Object>(url: string, data: I, options: Omit<IXHROptions, "data">): Promise<T | string> => {
  const r = await post<string>(url, JSON.stringify(data), { ...options, headers: { ...(options.headers || {}), "Content-Type": "application/json;charset=UTF-8" } })
  try {
    return JSON.parse(r)
  } catch (err) {
    return r
  }
}

export const postForm = <T>(url: string, data: HTMLFormElement, options: Omit<IXHROptions, "data"> = {}) =>
  post<T>(url, new FormData(data), options)

export const poll = <T>(url: string, rate: number = 200, check: (res: T) => boolean) =>
  new Promise<T>(async (resolve, reject) => {
    let done: boolean = false
    let res: any
    while (done === false) {
      await pause(rate)
      try {
        res = await getJSON(url)
        done = check(res)
      } catch (err) {
        reject(err)
      }
    }
    resolve(res)
  })

const pause = (ms: number) =>
  new Promise(r => setTimeout(r, ms))