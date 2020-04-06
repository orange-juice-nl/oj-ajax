# Ajax
Network request utils
IE11 compatible 

## Types
### Data
```typescript
string | FormData | Document | Blob | ArrayBufferView | ArrayBuffer | URLSearchParams
```
### IXHROptions 
```typescript
{
  data?: Data,
  headers?: { [k: string]: string },
  responseType?: XMLHttpRequestResponseType,
  progress?: (p: number) => void
}
```

## request
`request<T>(method: string, url: string, options: IXHROptions = {}): Promise<T>`
- opens a new XMLHttpRequest and uses the onload event to resolve or reject te promise

## get
`get<T>(url: string, options: Omit<IXHROptions, "data"> = {}): Promise<T>`

## post
`post<T>(url: string, data: Data, options: IXHROptions = {}): Promise<T>`

## getJSON
`getJSON<T>(url: string, options: IXHROptions = {}): Promise<T | string>`
- parses the response with `JSON.parse()`
- if parsing has failed, the response will be returned as a string

## postJSON
`postJSON<T extends Object, I extends Object>(url: string, data: I, options: Omit<IXHROptions, "data">): Promise<T | string>`
- stringifies the data with `JSON.stringify()`
- parses the response with `JSON.parse()`
- if parsing has failed, the response will be returned as a string

## postForm
`postForm<T>(url: string, data: HTMLFormElement, options: Omit<IXHROptions, "data"> = {}) : Promise<T>`
- gatheres all input fields within the form element as FormData

## poll
`poll<T>(url: string, rate: number = 200, check: (res: T) => boolean): Promise<T>`
- polls the url with the getJSON method
- the response gets delegated to the check callback
- when check returns true the poll is resolved