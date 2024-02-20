import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'

import UserController from './app/controllers/UserController'
import SessionsController from './app/controllers/SessionsController'
import ProductController from './app/controllers/ProductController'

const upload = multer(multerConfig)

const routes = new Router()

routes.post('/users', UserController.store)

routes.post('/sessions', SessionsController.store)

routes.post('/products',upload.single('file'), ProductController.store)

export default routes
