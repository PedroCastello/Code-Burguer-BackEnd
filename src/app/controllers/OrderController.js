import * as Yup from 'yup'
import Product from '../models/Product'
import Category from '../models/Category'
import Order from '../schemas/Order'
import User from '../models/User'

class OrderController {
  async store(request, response) {
    const schema = Yup.object().shape({
      products: Yup.array()
        .required()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          }),
        ),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const productsId = request.body.products.map((product) => product.id)

    const updatedProducts = await Product.findAll({
      where: { id: productsId },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    })

    const editedProduct = updatedProducts.map((product) => {
      const productIndex = request.body.products.findIndex(
        (reqProduct) => reqProduct.id === product.id,
      )

      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        url: product.url,
        quantity: request.body.products[productIndex].quantity,
      }

      return newProduct
    })

    const order = {
      user: {
        id: request.UserId,
        name: request.UserName,
      },
      products: editedProduct,
      status: 'Pedido realizado',
    }

    const orderResponse = await Order.create(order)

    return response.status(201).json(orderResponse)
  }
  async index(request, response) {
    const orders = await Order.find()

    return response.json(orders)
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      status: Yup.string().required(),
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

    const { id } = request.params
    const { status } = request.body

    try {
      await Order.updateOne({ _id: id }, { status })
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }
    return response.json({ message: 'status was updated' })
  }

  async delete(request, response) {
    const { admin: isAdmin } = await User.findByPk(request.UserId);
  
    if (!isAdmin) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      await Order.deleteMany({}); // Excluir todas as ordens no MongoDB
      return response.status(204).send();
    } catch (error) {
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new OrderController()
