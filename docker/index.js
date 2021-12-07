const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const hostname = '0.0.0.0';
const port = 8443;

const privateKey = fs.readFileSync('tls.key').toString();
const certificate = fs.readFileSync('tls.crt').toString();

const options = {key: privateKey, cert: certificate};

const app = express();
app.use(bodyParser.json());

app.post('/validateingress', (req, res) => {
	console.log(req.body)
	console.log(req.body.request.object)
	let response = {
		apiVersion: 'admission.k8s.io/v1',
		kind: 'AdmissionReview',
		response:{
		  uid: req.body.request.uid,
          allowed: false,
        }}
        console.log(response)
	res.send(response)
})


const server = https.createServer(options, app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
