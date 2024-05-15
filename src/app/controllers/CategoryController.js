import * as Yup from 'yup'
import Category from '../models/Category'
import User from '../models/User'

class CategoryController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { admin: isAdmin } = await User.findByPk(request.UserId)

    if (!isAdmin) {
      return response.status(401).json()
    }

    const { name } = request.body

    const { filename: path } = request.file

    const categoryExists = await Category.findOne({
      where: { name },
    })

    if (categoryExists) {
      return response.status(400).json({ error: 'Category already exists' })
    }

    const { id } = await Category.create({
      name,
      path,
    })
    return response.json({ name, id })
  }
  async index(request, response) {
    const category = await Category.findAll()

    return response.json(category)
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { admin: isAdmin } = await User.findByPk(request.UserId)

    if (!isAdmin) {
      return response.status(401).json()
    }

    const { name } = request.body

    const { id } = request.params

    const category = await Category.findByPk(id)

    if (!category) {
      return response.status(401).json({ error: "Make sure 'id' is correct" })
    }

    let path
    if (request.file) {
      path = request.file.filename

      await Category.update({
        name,
        path,
      }, {where: { id } })
      return response.status(200).json()
    }
  }

  async update(request, response) {
    // Código existente para atualizar uma categoria
  }

  async delete(request, response) {
    const { admin: isAdmin } = await User.findByPk(request.UserId);

    if (!isAdmin) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    try {
      await Category.destroy({ where: {} });

      return response.status(204).send();
    } catch (error) {
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new CategoryController()
