const serverless = require("serverless-http");
const app = require("./index");

module.exports.handler = serverless(app, {
  // opcional, pero ayuda con rutas/headers si tienes cosas raras
  request: (req, event, context) => {
    req.context = context;
    req.event = event;
  }
});
