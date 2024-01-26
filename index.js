const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(
  `mongodb+srv://${username}:${password}@register.dbbjrng.mongodb.net/registrationFormDB`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  dob: Date,
  phone: String,
  password: String,
  confirmpassword: String,
});

const Registration = mongoose.model("Registration", registrationSchema);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("front"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/front/index.html");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, dob, phone, password, confirmpassword } = req.body;
    const existingUser = await Registration.findOne({ email: email });
    //check for existing user
    if (!existingUser) {
      const registrationData = new Registration({
        name,
        email,
        dob,
        phone,
        password,
        confirmpassword,
      });
      await registrationData.save();
      res.redirect("/success");
    } else {
      // res.status(400).send("User already exists");
      res.redirect("/userexists");
    }
  } catch (error) {
    res.redirect("/error");
    console.log(error);
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/front/success.html");
});
app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/front/error.html");
});
app.get("/userexists", (req, res) => {
  res.sendFile(__dirname + "/front/userexists.html");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
