const core = require("@actions/core");
const { promisify } = require("util");
const { exec } = require("child_process");
const execAsync = promisify(exec);

async function run() {
    try {
        const config = loadConfig();
        const sourcePath = process.env.GITHUB_WORKSPACE;
        await checkAzureCliIsAvailable();
        await configureAppSettings(config);
        await deploy(sourcePath, config);
    } catch (error) {
        core.setFailed(error.message);
    }
}

function loadConfig() {
    const appName = core.getInput("app-name");
    if (!appName) {
        throw new Error("App name is missing");
    }
    console.log(`App name: ${appName}`)

    return { appName };
}

async function execCommand(command, errorMessage) {
    try {
        await execAsync(command);
    } catch (error) {
        console.log(errorMessage);
        throw error;
    }
}

async function checkAzureCliIsAvailable() {
    await execCommand('az --version', 'Unable to find Azure CLI')
}

async function deploy(sourcePath, config) {
    console.log("Deploying the application...");
    console.log(sourcePath);
    console.log(config);
}

run();