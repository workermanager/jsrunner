#!/usr/bin/env node
const spawn = require("child_process").spawn
const platform = require("os").platform()
var cmd = "";

switch (platform) {
    case "win32":
        cmd = __dirname + "/runner_win.exe";
        break;
    case "darwin":
        cmd = __dirname + "/runner_darwin";
        break;
    case "freebsd":
        cmd = __dirname + "/runner_darwin";
        break;
    default:
        cmd = __dirname + "/runner_linux";
        break;
}
spawn(cmd, process.argv.slice(2), { stdio: "inherit" }).on("exit", code => process.exit(code));
