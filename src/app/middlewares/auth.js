import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

export default (request, response, next) => {
  const authToken = request.headers.authorization

  if (!authToken) {
    return response.status(401).json({ error: 'Token not provided' })
  }

  const token = authToken.split(' ')[1]

  // console.log(token)

  try {
    jwt.verify(token, authConfig.secret, function (err, decoded) {
      if (err) {
        throw new Error()
      }

      request.UserId = decoded.id
      request.UserName = decoded.name

      return next()
    })
  } catch (err) {
    return response.status(401).json({ error: 'Invalid token' })
  }
}
