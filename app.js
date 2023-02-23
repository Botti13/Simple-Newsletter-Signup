const express = require("express");
const client = require("@mailchimp/mailchimp_marketing");
require("dotenv").config();

const app = express();
const MAPI_KEY = process.env.API_KEY
const MLIST_ID = process.env.LIST_ID
const MAPI_SERVER = process.env.API_SERVER

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

client.setConfig({
  
    apiKey: MAPI_KEY,
    server: MAPI_SERVER
  });

app.post("/", (req, res) => {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const email = req.body.email;

    const subscribingUser = {
        nombre: nombre,
        apellido: apellido,
        email: email
    }

    const run = async () => {
        try {  
            const response = await client.lists.addListMember(MLIST_ID, {
             email_address: subscribingUser.email,
             status: "subscribed",
             merge_fields: {
             FNAME: subscribingUser.nombre,
             LNAME: subscribingUser.apellido
             }
            });
    
            res.sendFile(__dirname + "/success.html");
        } catch (error) {
            console.log(error.status);
            res.sendFile(__dirname + "/failure.html");
        }
    };
    
    run();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
  });

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port " + process.env.PORT);
});