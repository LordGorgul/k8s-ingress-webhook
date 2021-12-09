module.export = {
    validate: function (req){
        let allowed = true;
        let errors = [''];
        let responseCode = 200;
        let ingress = req.body.request.object;
        let namespace = ingress.metadata.namespace;
        let nsNoPrefix = namespace.match(/(?<=ns-).+/);
        let configuration = JSON.parse(ingress.metadata.annotations['kubectl.kubernetes.io/last-applied-configuration']);
    
        if (configuration.metadata.annotations['haproxy-ingress.github.io/secure-backends'] != "true"){
            errors.push('The annotation haproxy-ingress.github.io/secure-backends must be set to "true"');
            console.log(errors[errors.length-1]);
            allowed = false;
        }
    
        for (var rule of configuration.spec.rules[0].http.paths){
            if (!rule.path.startsWith("/" + nsNoPrefix)){
                errors.push(`Path ${rule.path} needs to start with /${nsNoPrefix}`);
                console.log(errors[errors.length-1]);
                allowed = false;
            }
        }
    
        return {
            apiVersion: 'admission.k8s.io/v1',
            kind: 'AdmissionReview',
            response:{
              uid: req.body.request.uid,
              allowed: allowed,
              status: {
                  code: responseCode,
                  message: errors.join('\n')
              }
            }
        }
    }
}