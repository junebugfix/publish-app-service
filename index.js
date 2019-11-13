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
    const configString = core.getInput("configuration");
    if (!configString) {
        throw new Error("Configuration is missing");
    }
    const config = JSON.parse(configString);

    // TODO: validate config has right properties

    return config;
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