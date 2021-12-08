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

app.post('/validateingress', (req, res) => {
	let allowed = true;
	let msg = "Ingress Rule is valid";
	let responseCode = 200;
	let ingress = req.body.request.object;
	let namespace = ingress.metadata.namespace;
	let nsNoPrefix = namespace.match(/(?<=ns-).+/);
	let configuration = JSON.parse(ingress.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration']);

	console.log("New Request:");
	console.log(req.body);
	console.log(ingress);
	
	if (namespace != configuration.metadata.namespace){
		console.error("Namespace mismatch! " + namespace + " != " + configuration.metadata.namespace);
		allowed = false;
	}

	if (configuration.metadata.annotations['haproxy-ingress.github.io/secure-backends'] != "true"){
		msg = 'The annotation haproxy-ingress.github.io/secure-backends must be set to "true"';
		console.log(msg);
		allowed = false;
	}

	for (var rule of configuration.spec.rules[0].http.paths){
		if (!rule.path.startsWith("/" + nsNoPrefix)){
			msg = "Path needs to start with /" + nsNoPrefix;
			console.log(msg);
			allowed = false;
		}
	}

	let response = {
		apiVersion: 'admission.k8s.io/v1',
		kind: 'AdmissionReview',
		response:{
		  uid: req.body.request.uid,
		  allowed: allowed,
		  status: {
			  code: responseCode,
			  message: msg
		  }
		}
	}

	console.log(response)
	res.send(response)
})


const server = https.createServer(options, app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
