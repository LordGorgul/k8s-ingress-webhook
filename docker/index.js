const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
require('console-stamp')(console)

const hostname = '0.0.0.0';
const port = 35000;
const privateKey = fs.readFileSync('/etc/certs/tls.key').toString();
const certificate = fs.readFileSync('/etc/certs/tls.crt').toString();

const options = {key: privateKey, cert: certificate};

const app = express();

app.use(bodyParser.json());

app.post('/validate', (req, res) => {
	try {
		var validation = require('/etc/config/validation.js')
	}
	catch (ex){
		console.error(ex)
	}
	let response = {
		apiVersion: 'admission.k8s.io/v1',
		kind: 'AdmissionReview',
		response:{
		  uid: req.body.request.uid,
		  allowed: true,
		  status: {
			  code: 200,
			  message: 'No validation method detected'
			}
		}
	}

	console.log("New Request:");
	console.log(req.body);
	console.log(req.body.request.object);

	if (validation.validate) {
		response = validation.validate(req);
	}
	console.log(response);
	res.send(response);
})


const server = https.createServer(options, app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
