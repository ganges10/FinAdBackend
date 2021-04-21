const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser')
const cors = require('cors')

mongoose.connect(process.env.uri,{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('DB connected'))

mongoose.connection.on('error',err => {
  console.log(`DB connection error: ${err.message}`);
});
const userRoutes = require("./Routes/user");
const authRoutes = require("./Routes/auth");
const forecastRoutes = require("./Routes/forecast");
const remRoutes = require("./Routes/reminder");

app.use(bodyparser.json())
app.use(cookieparser())
app.use(cors());
app.use("/api",userRoutes);
app.use("/api",authRoutes);
app.use("/api",forecastRoutes);
app.use("/api",remRoutes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`active port : ${port}`);
});

app.get("/gold",goldPredict);
app.get("/mutualf",mutualFund);

function goldPredict(req, res) {

	var spawn = require("child_process").spawn;
	
	var process = spawn('python',["./gold.py"]);

	process.stdout.on('data', function(data) {
		res.send(data.toString());
	} )
}

function mutualFund(req, res) {

	var spawn = require("child_process").spawn;
	
	var process = spawn('python',["./mfund.py"]);

	process.stdout.on('data', function(data) {
		res.send(data.toString());
	} )
}




