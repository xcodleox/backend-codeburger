import * as Yup from "yup"
import User from '../models/User'
import jwt from 'jsonwebtoken'
import auth from '../../config/auth'
class SessionController {
    async store(request, response) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        })

        try {
            await schema.validateSync(request.body, { abortEarly: false })
        } catch (error) {
            return response.status(400).json({ error: 'Algo esta Errado!' })
        }

        const { email, password } = request.body
        const user = await User.findOne({
            where: { email },
        })

        if (!user) {
            return response
                .status(400)
                .json({ error: 'Algo esta Errado!' })
        }

        if (!(await user.checkPassword(password))) {
            return response
                .status(401)
                .json({ error: 'Algo esta Errado!' })
        }

        return response.json(
            {
                id: user.id,
                email,
                name: user.name,
                admin: user.admin,
                token: jwt.sign({ id: user.id, name: user.name,}, auth.secret,
                    {
                        expiresIn: auth.expiresIn,
                    }),
            })
    }
}

export default new SessionController()