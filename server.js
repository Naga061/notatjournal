require('dotenv').config();
const express = require('express');
const app = express()
const cors = require("cors")
const PORT = 3001

const bcrypt = require('bcrypt')
const saltRounds = 12


app.use(cors())
app.use(express.json())

const {Pool} = require('pg')
const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database:'Notat',
    password:process.env.Db_passowd,
    port:5432
});


app.listen(PORT,()=>{
    console.log(`servern kjører på http://localhost:${PORT}`);
});


app.get("/bruker",(req,res) =>{
    res.json({navn:"Ole",alder:20})
});


app.post("/registrer", async(req,res) =>{
    try{
    const saltRounds = 12
   const {brukernavn, passord} = req.body
   const nyBruker = 'INSERT INTO bruker(brukernavn,passord) VALUES($1,$2) RETURNING * '
   
   if ((brukernavn == "" || brukernavn==undefined) && (passord=="" ||passord==undefined)){
    res.status(400).json("Fyll inn brukernavn og passord ")
    
   }
   else if (brukernavn=="" || brukernavn==undefined){
    res.status(400).json("Fyll inn brukernavn felt")
   }

   else if(passord=="" || passord == undefined){
    res.status(400).json("Fyll inn passordet felt")
   }

   else{
     const hasedpassord = await bcrypt.hash(passord,saltRounds)
    const brukerinfo= [brukernavn,hasedpassord]
    const nyPGreg= await pool.query (nyBruker,brukerinfo)
    res.status(201).json(`Bruker ${brukernavn} er registrert`)
   }
}

catch(error){
    console.log(error)
    res.status(500).json("Databasefeil")
}

})




