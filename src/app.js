import express from 'express'
import path from 'path'
import routes from './routes'
import { resolve } from 'path'

import './database'

class App {
  constructor() {
    this.app = express()
    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.app.use(express.json())
    this.app.use(
      '/product-file',
      express.static(path.join(__dirname, '..', 'uploads')),
    )

    this.app.use(
      '/category-file',
      express.static(path.join(__dirname, '..', 'uploads')),
    )
  }

  routes() {
    this.app.use(routes)
  }
}

export default new App().app
