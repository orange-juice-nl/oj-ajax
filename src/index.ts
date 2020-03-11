export type Data = string | FormData | Document | Blob | ArrayBufferView | ArrayBuffer | URLSearchParams

export const requestRaw = (method: string, url: string, data?: Data, contentType?: string, responseType?: string, progress?: (p: number) => void) =>
  new Promise<XMLHttpRequest>((res, rej) => {
    let upProgress = 0
    let downProgress = 0
    const emitProgress = () => typeof progress === "function" && progress((upProgress + downProgress) * .5)

    const xhr = new XMLHttpRequest()
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) res(xhr)
      else rej(xhr)
    }
    if (typeof progress === "function") {
      if (xhr.upload) xhr.upload.onprogress = e => { upProgress = Math.ceil((e.loaded / e.total) * 100); emitProgress() }
      xhr.onprogress = e => { downProgress = Math.ceil((e.loaded / e.total) * 100); emitProgress() }
    }
    xhr.onerror = () => rej(xhr)
    xhr.open(method, url, true)
    if (contentType) xhr.setRequestHeader('Content-Type', contentType)
    if (responseType) xhr.setRequestHeader('Response-Type', responseType)
    xhr.send(data)
  })

export const request = <T>(method: string, url: string, data?: Data, contentType?: string, responseType?: string, progress?: (p: number) => void): Promise<T> =>
  requestRaw(method, url, data, contentType, responseType, progress)
    .then(xhr => xhr.response || xhr.responseText)
    .catch(xhr => ({ status: xhr.status, statusText: xhr.statusText }))

export const get = <T>(url: string, options: { contentType?: string, responseType?: string, progress?: (p: number) => void } = {}) =>
  request<T>("GET", url, undefined, options.contentType, options.responseType, options.progress)

export const post = <T>(url: string, data: Data, options: { contentType?: string, responseType?: string, progress?: (p: number) => void } = {}) =>
  request<T>("POST", url, data, options.contentType, options.responseType, options.progress)

export const getJSON = <T>(url: string, options: { progress?: (p: number) => void } = {}) =>
  get<string>(url, { ...options, contentType: "application/json;charset=UTF-8" }).then(x => JSON.parse(x) as T)

export const postJSON = async <T extends Object>(url: string, data: T, options: { progress?: (p: number) => void } = {}) => {
  const r = await post<string>(url, JSON.stringify(data), { ...options, contentType: "application/json;charset=UTF-8" })
  try {
    return JSON.parse(r)
  } catch (err) {
    return r
  }
}

export const postForm = async (url: string, data: HTMLFormElement, options: { progress?: (p: number) => void } = {}) =>
  post(url, new FormData(data), options)

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