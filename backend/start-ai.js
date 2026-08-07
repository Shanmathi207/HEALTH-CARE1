const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const workspaceVenv = path.resolve(__dirname, '..', '..', '.venv', 'Scripts', 'python.exe');
const backendVenv = path.resolve(__dirname, '..', '.venv', 'Scripts', 'python.exe');
const pythonExe = fs.existsSync(workspaceVenv)
  ? workspaceVenv
  : fs.existsSync(backendVenv)
    ? backendVenv
    : 'python';

const script = path.join(__dirname, 'app.py');

const child = spawn(pythonExe, [script], {
  cwd: __dirname,
  stdio: 'inherit'
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`AI service exited with code ${code}`);
    process.exit(code);
  }
});
