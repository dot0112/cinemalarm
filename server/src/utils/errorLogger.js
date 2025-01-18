function errorLogger(err) {
    const stack = new Error().stack.split("\n")[2];
    const callerLine = stack?.trim();
    const callerName = callerLine?.split(" ")[1] || "Unknown";
    const fileName = callerLine?.match(/\((.*?):\d+:\d+\)/)?.[1] || "Unknown";

    const errorMessage =
        err?.message || (typeof err === "string" ? err : "Unknown error");

    console.error(`[ERROR] ${fileName}: ${callerName} - ${errorMessage}`);
}

global.errorLogger = errorLogger;
