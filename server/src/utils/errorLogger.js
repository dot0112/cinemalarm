const path = require("path");

function errorLogger(err, req) {
    const stackTrace = {};
    Error.captureStackTrace(stackTrace);
    const callerName = stackTrace.stack.split("\n")[2].trim().split(" ")[1];
    const fileName =
        req && req.route ? path.basename(req.route.path) : "Unknown";
    console.error(`[ERROR] ${fileName}: ${callerName} - ${err}`);
}

global.errorLogger = errorLogger;
