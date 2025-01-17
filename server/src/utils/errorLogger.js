const path = require("path");

function errorLogger(err) {
    const stackTrace = {};
    Error.captureStackTrace(stackTrace);
    const callerLine = stackTrace.stack.split("\n")[2]?.trim();
    const callerName = callerLine?.split(" ")[1] || "Unknown";
    const fileName = callerLine?.match(/\((.*?):\d+:\d+\)/)?.[1] || "Unknown";
    console.error(`[ERROR] ${fileName}: ${callerName} - ${err.message || err}`);
}

global.errorLogger = errorLogger;
