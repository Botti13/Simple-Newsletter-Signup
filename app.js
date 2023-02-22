const express = require("express");
const client = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

client.setConfig({
    apiKey: "d07917534b48d60231a7abf6b28050bf-us21",
    server: "us21"
  });

app.post("/", (req, res) => {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const email = req.body.email;
    const listId = "c73f07bd48";

    const subscribingUser = {
        nombre: nombre,
        apellido: apellido,
        email: email
    }

    const run = async () => {
        try {  
            const response = await client.lists.addListMember(listId, {
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
  console.log("Server running on port 3000");
});

//API key
// d07917534b48d60231a7abf6b28050bf-us21

//list ID
// c73f07bd48