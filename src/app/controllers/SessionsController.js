import * as Yup from 'yup'
import Jwt from 'jsonwebtoken'
import User from '../models/User'
import authConfig from '../../config/auth'

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    const userEmailOrPassordIncorrect = () => {
      return response
        .status(400)
        .json({ error: 'Make sure your password and email are correct' })
    }

    if (!(await schema.isValid(request.body))) {
      userEmailOrPassordIncorrect()
    }

    const { email, password } = request.body

    try {
      const user = await User.findOne({
        where: { email },
      })

      if (!user) {
        userEmailOrPassordIncorrect()
      }

      if (!(await user.checkPassword(password))) {
        userEmailOrPassordIncorrect()
      }

      return response.json({
        id: user.id,
        email,
        name: user.name,
        admin: user.admin,
        token: Jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error: 'Internal server error' })
    }
  }
}

export default new SessionController()
