#!/usr/bin/env node

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const lgtv = require('lgtv2');
const wol = require('wake_on_lan');
const readline = require('readline');

// ⚙️ CONFIGURATION
const targetMAC = '00:a1:59:2b:a8:ec'; // Used for ON (Wake on LAN)

// 🖥️ COMMAND PARSING
const args = process.argv.slice(2);

// Check for --ip flag
let manualIP = null;
const ipIndex = args.indexOf('--ip');
if (ipIndex > -1) {
    manualIP = args[ipIndex + 1];
    args.splice(ipIndex, 2);
}

const command = args[0] ? args[0].toUpperCase() : "";
const fullMessage = args.join(' ');

// Usage Info
if (!command && !manualIP) {
    console.log("-----------------------------------------");
    console.log("👻 GHOST TV CONTROLLER (v3.0) 👻");
    console.log("-----------------------------------------");
    console.log("Usage:");
    console.log("  node tv_say.js ON");
    console.log("  node tv_say.js OFF");
    console.log("  node tv_say.js [Message]");
    console.log("");
    console.log("Options:");
    console.log("  --ip [IP]   Skip prompt and use this IP");
    console.log("-----------------------------------------");
    process.exit(0);
}

// 📡 FUNCTION: Ask for IP interactively
function askForIp() {
    if (manualIP) return Promise.resolve(manualIP);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('📺 Please enter TV IP Address: ', (answer) => {
            rl.close();
            const cleanIp = answer.trim();
            if (!cleanIp) {
                console.log("❌ No IP entered. Exiting.");
                process.exit(1);
            }
            resolve(cleanIp);
        });
    });
}

// 🔌 EXECUTE
(async () => {
    // --- ON COMMAND ---
    if (command === "ON") {
        console.log(`🔌 Broadasting Wake-On-LAN to ${targetMAC}...`);
        for (let i = 0; i < 3; i++) wol.wake(targetMAC);
        console.log("✨ Wake command sent! (TV may take a moment to boot)");
        // We still need IP to connect and confirm/launch logic
    }

    // --- GET IP ---
    const targetIP = await askForIp();
    console.log(`🎯 Targeting ID: ${targetIP}`);

    // --- CONNECT ---
    const tv = lgtv({
        url: `wss://${targetIP}:3001`,
        timeout: 5000,
        reconnect: 0,
        wsconfig: { rejectUnauthorized: false }
    });

    console.log("connecting...");

    tv.on('connect', function () {
        if (command === "OFF") {
            console.log('✅ Connected! Turning off...');
            tv.request('ssap://system/turnOff', function (err, res) {
                if (!err) console.log("👋 TV Off.");
                setTimeout(() => { tv.disconnect(); process.exit(0); }, 500);
            });
        } else if (command === "ON") {
            console.log('✅ Connected! Launching Live TV to clear "No Signal"...');
            tv.request('ssap://system.launcher/launch', { id: 'com.webos.app.livetv' });
            tv.request('ssap://system.notifications/createToast', { message: "TV is ON" });
            setTimeout(() => { tv.disconnect(); process.exit(0); }, 2000);
        } else {
            console.log(`✅ Connected! Saying: "${fullMessage}"`);
            tv.request('ssap://com.webos.service.tts/speak', { text: fullMessage, clear: true, language: "en-US" });
            tv.request('ssap://system.notifications/createToast', { message: fullMessage });
            setTimeout(() => { tv.disconnect(); process.exit(0); }, 1000);
        }
    });

    tv.on('error', function (err) {
        console.error('❌ Error connecting to TV:', err.code || err);
        console.log("👉 Double check the IP address.");
        process.exit(1);
    });
})();
