// creates a list of tags in the order they where created
$(function() {
    var tags = [];

    $("#input_apiKey").hide();

    var url = window.location.search.match(/url=([^&]+)/);
    log("karan");
    log(url);
    if (url && url.length > 1) {
        url = decodeURIComponent(url[1]);
    } else {
        url = "/swagger.json";
    }
    ///url = 'http://localhost:3000/temp.json';

    // Pre load translate...
    if (window.SwaggerTranslator) {
        window.SwaggerTranslator.translate();
    }

    // pull validatorUrl string or null form server
    var validatorUrl = null;
    validatorUrl: "//online.swagger.io/validator";

    var ACCESS_TOKEN_QUERY_PARAM_NAME = "access_token";
    var accessToken = getUrlVars()[ACCESS_TOKEN_QUERY_PARAM_NAME];

    window.swaggerUi = new SwaggerUi({
        url:
            '/docs' +
            (accessToken
                ? (url.indexOf("?") < 0 ? "?" : "&") +
                  ACCESS_TOKEN_QUERY_PARAM_NAME +
                  "=" +
                  accessToken
                : ""),
        dom_id: "swagger-ui-container",
        supportedSubmitMethods: ["get", "post", "put", "delete", "patch"],
        onComplete: function(swaggerApi, swaggerUi) {
            if (typeof initOAuth == "function") {
                initOAuth({
                    clientId: "your-client-id",
                    clientSecret: "your-client-secret",
                    realm: "your-realms",
                    appName: "your-app-name",
                    scopeSeparator: ","
                });
            }

            if (window.SwaggerTranslator) {
                window.SwaggerTranslator.translate();
            }

            $("pre code").each(function(i, e) {
                hljs.highlightBlock(e);
            });

            if (
                Array.isArray(swaggerApi.auths) &&
                swaggerApi.auths.length > 0 &&
                swaggerApi.auths[0].type === "apiKey"
            ) {
                auth = swaggerApi.auths[0].value;
                $("#input_apiKey").show();
            }
            addApiKeyAuthorization();

            // load complete custom js
        },
        onFailure: function(data) {
            log("Unable to Load SwaggerUI", data);
        },
        docExpansion: "full",
        apisSorter: apisSorter.default,
        operationsSorter: operationsSorter.path,
        showRequestHeaders: false,
        validatorUrl: validatorUrl,
        jsonEditor: false
    });

    function addApiKeyAuthorization() {
        if ($("#input_apiKey")) {
            var key = $("#input_apiKey")[0].value;
            if (key && key.trim() != "") {
                if ("" !== "") {
                    key = "" + key;
                }
                var apiKeyAuth = new SwaggerClient.ApiKeyAuthorization(
                    auth.name,
                    key,
                    auth.in
                );
                window.swaggerUi.api.clientAuthorizations.add(
                    auth.name,
                    apiKeyAuth
                );
                log("added key " + key);
            }
        }
    }

    function getUrlVars() {
        var vars = [],
            hash;
        var hashes = window.location.href
            .slice(window.location.href.indexOf("?") + 1)
            .split("&");
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split("=");
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    $("#input_apiKey").change(addApiKeyAuthorization);

    /*
    // if you have an apiKey you would like to pre-populate on the page for demonstration purposes...

    var apiKey = "Bearer 12345";
    $('#input_apiKey').val(apiKey);

    */

    window.swaggerUi.load();

    function log() {
        if ("console" in window) {
            console.log.apply(console, arguments);
        }
    }
});

