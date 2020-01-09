const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public")); //static folder to get images and css

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.sendFile(__dirname + "/signup.html"));

app.post("/", (req, res) => {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {              //These values correspond to Mailchimp API 
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }
      }
    ]
  };
  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://usX.api.mailchimp.com/3.0/lists/${audience_id}", //usX depends on ending of API Key, change Audience ID at the end
    method: "POST",
    headers: {
      Authorization: "anystring ${APi_key}" //authorize yourself with API key
    },
    body: jsonData
  };
  request(options, (error, response, body) => {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
});

app.post("/failure", (req, res) => res.redirect("/"));

app.listen(process.env.PORT || 3000, () => console.log("Server running on port 3000")); //process.env.PORT globally(on Heroku) or local port 3000
