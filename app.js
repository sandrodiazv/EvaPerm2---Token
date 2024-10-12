const express = require('express')
const jwt = require('jsonwebtoken')
const config = require('./public/scripts/config.js')
const path = require('path')
const port = 3030

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    console.log('Estamos en la pagina principal')
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

app.post('/register', (req, res) => {
    console.log(`Post pagina de registro ${req.body.username}`)
    console.log(`Post pagina de registro ${req.body.password}`)

    if(`${req.body.username}` === 'Sandro Diaz' && `${req.body.password}` === '30') {
        console.log('Username: ' + `${req.body.username}` + ', Password: ' + `${req.body.password}`)
        const user = {
            username: `${req.body.username}`,
            password: `${req.body.password}`
        }
        jwt.sign({user: user}, 'secretkey', {expiresIn: '200s'}, (err, token) => {
            res.json({token: token})
        })
    } else {
        return res.status(401).json({
            auth: false,
            message: 'No token valido'
        })
    }
})

app.post('/login', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) { 
            res.sendStatus(403)
        } else {
            res.json({
                message: 'Usuario creado',
                authData: authData
            })
        }
    })
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(' ')[1]
        req.token = bearerToken
        next()
    } else {
        res.status(401)
    }
}

app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}, http://localhost:${port}`)
})