import { request } from 'config/axios'

export const http = (store) => (next) => async (action) => {
  if (action.payload && action.payload.url) {
    const { method, url, params, body, header } = action.payload

    let config = {
      method,
      url,
      params
    }

    body && (config = { ...config, data: body })
    header && (config = { ...config, headers: header })

    // multipart queries
    if (header && header['Content-Type'] === 'multipart/form-data') {
      const bodyFormData = new FormData()

      Object.keys(body).map((key) => {
        bodyFormData.append(key, body[key])
      })

      config = { ...config, data: bodyFormData }
    }

    try {
      action.result = await request(config)
    } catch (error) {
      action.error = error
    }
  }

  // console.log('action ==== ', action)

  return next(action)
}