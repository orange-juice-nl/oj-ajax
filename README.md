# Ajax
Network request utils
IE11 compatible 

## request
`request(method: string, url: string, data?: any, contentType?: string, raw?: boolean): Promise<any>`
- opens a new XMLHttpRequest and uses the onload event to resolve or reject te promise
- **if raw === true** it will return the xhr object, not the xhr.response text

## get
`get(url: string, contentType?: string, raw?: boolean): Promise<any>`
- a shorthand for request (`method: "GET"`)

## getJSON
`<T>get(url: string): Promise<T>`
- a shorthand for get (`contentType: "application/json;charset=UTF-8"`)
- parses the response with `JSON.parse()`

## post
`post(url: string, data: any, contentType?: string, raw?: boolean): Promise<any>`
- a shorthand for request (`method: "POST"`)

## postJSON
`postJSON(url: string, data: any, raw?: boolean): Promise<any>`
- a shorthand for post (`contentType: "application/json;charset=UTF-8"`)
- parses the data with `JSON.stringify()`

## postForm
`postForm(url: string, data: HTMLFormElement, raw?: boolean): Promise<any>`
- a shorthand for post
- parses the data with `new FormData(data)`

## poll
`poll(url: string, rate: number = 200, check: (res: any) => boolean): Promise<any>`
- polls the url with the getJSON method
- the response gets delegated to the check callback
- when check returns true the poll is resolved