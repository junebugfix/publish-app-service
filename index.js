const core = require('@actions/core');
const { promisify } = require('util');
const { exec } = require('child_process');
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
    const appName = getConfigItem('app-name');
    const secrets = getConfigItem('secrets');
    return { appName, secrets };
}

function getConfigItem(key) {
    const item = core.getInput(key);
    if (!item) {
        throw new Error(`Config item '${key}' is missing.`)
    }
    return item;
}

async function execCommand(command, description) {
    try {
        await execAsync(command);
    } catch (error) {
        console.log(`Command failed: ${description} (${command})`);
        throw error;
    }
}

async function checkAzureCliIsAvailable() {
    await execCommand('az --version', 'Find Azure CLI');
}

async function configureAppSettings(config) {
    console.log('Configuring app settings...');
    console.log('Config:');
    console.log(config);
}

async function deploy(sourcePath, config) {
    console.log('Deploying the application...');
    console.log(sourcePath);
    console.log(config);
}

run();