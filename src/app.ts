import express from 'express'
import cookieParser from 'cookie-parser'
import authRouter from './routers/auth'
import userRouter from './routers/user'
import orderRouter from './routers/order'
import transferRouter from './routers/transfer'
import productRouter from './routers/product'

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/order', orderRouter)
app.use('/transfer', transferRouter)
app.use('/products', productRouter)

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})