const express = require('express')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = process.env.PORT || 5000

const db = require("./server");
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs')     // Setamos que nossa engine será o ejs
app.use(expressLayouts)           // Definimos que vamos utilizar o express-ejs-layouts na nossa aplicação
app.use(bodyParser.urlencoded())  // Com essa configuração, vamos conseguir parsear o corpo das requisições

app.use(express.static(__dirname + '/public'))
app.listen(port, () => {
    console.log(`A mágica acontece em http://localhost:${port}`)
})

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
    
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection("mysql://root:123456@localhost:3306/cot_db");
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

async function selectCotacoes(){
    const conn = await connect();            
    const [rows] = await conn.query('SELECT * FROM listacot;');
    return rows;
    console.log(rows);    
}

connect();



app.get('/about', async (req, res) => {   
    const conn = await connect();            
    const [rows] = await conn.query('SELECT * FROM listacot;');
    res.render('pages/about', { rows })
})


module.exports = {connect}
module.exports = {selectCotacoes}