import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import tmp from 'tmp';
import fs from 'fs-extra';
import path from 'path';

// Create an instance of Express
const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(bodyParser.json());

/**
 * POST /run-clvm
 * Accepts CLVM code and its parameters, executes it using chia dev tools,
 * and returns the result.
 *
 * Body:
 * {
 *   "clvm_code": "your_clvm_code",
 *   "params": ["param1", "param2"]
 * }
 */

// @ts-ignore
app.post('/run-clvm', (req: Request, res: Response, next: NextFunction) => {
    const { clvm_code, params }: { clvm_code: string; params?: string[] } = req.body;

    if (!clvm_code) {
        return res.status(400).json({ error: 'CLVM code is required' });
    }

    // Create a temporary directory with auto-cleanup after 5 minutes
    const tempDir = tmp.dirSync({ prefix: 'clvm-', unsafeCleanup: true });

    try {
        // Path to the temporary CLVM file
        const clvmFilePath = path.join(tempDir.name, 'temp.clvm');
        const clvmArgs = params ? params.join(' ') : '';

        // Write the CLVM code to the temporary file
        fs.writeFileSync(clvmFilePath, clvm_code);

        // Command to run CLVM using chia dev tools
        const command = `run -i ${clvmFilePath} ${clvmArgs}`;

        // Execute the CLVM command using child_process
        exec(command, { cwd: '/chia-dev-tools/venv/bin' }, (error, stdout, stderr) => {
            // Cleanup the temporary directory
            tempDir.removeCallback();

            if (error) {
                console.error(`Error executing CLVM: ${error.message}`);
                return res.status(500).json({ error: 'Error running CLVM' });
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }

            // Send back the result of the CLVM execution
            return res.json({ result: stdout });
        });
    } catch (err) {
        console.error(`An error occurred: ${err}`);
        tempDir.removeCallback(); // Ensure cleanup on error
        return res.status(500).json({ error: 'An internal server error occurred' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
