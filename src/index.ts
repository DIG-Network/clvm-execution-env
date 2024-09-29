import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import { promisify } from 'util';

// Create an instance of Express
const app = express();
const port = process.env.PORT || 4363;

// Promisify the exec function to use async/await
const execPromise = promisify(exec);

// Middleware to parse JSON body
app.use(bodyParser.json());

/**
 * POST /run-chialisp
 * Accepts Chialisp code, runs it directly using `run` and `brun` in one line.
 *
 * Body:
 * {
 *   "clvm_code": "your_clvm_code",
 *   "params": ["param1", "param2"]
 * }
 */
// @ts-ignore
app.post('/run-chialisp', async (req: Request, res: Response, next: NextFunction) => {
    let { clvm_code, params }: { clvm_code: string; params?: string[] } = req.body;

    if (!clvm_code) {
        return res.status(400).json({ error: 'Chialisp code is required' });
    }

    // Unescape internal quotes in the Chialisp code
    clvm_code = clvm_code.replace(/\\"/g, '"');

    // Log the incoming Chialisp code
    console.log(`Received Chialisp code: ${clvm_code}`);

    try {
        // Construct the one-liner command using `run` and `brun`
        const clvmArgs = params ? `(${params.join(' ')})` : 'nil'; // Wrap params in parentheses
        const command = `brun "$(run "${clvm_code}")" "${clvmArgs}"`;

        console.log(`Executing command: ${command}`);

        // Execute the one-liner `brun "$(run ...)"` command
        const { stdout, stderr } = await execPromise(command);

        if (stderr) {
            console.error(`CLVM execution errors: ${stderr}`);
        }

        // Trim the output of CLVM execution to remove any trailing newlines or spaces
        const trimmedResult = stdout.trim();

        // Log the result
        console.log(`CLVM execution result: ${trimmedResult}`);

        // Send back the result of the CLVM execution
        return res.json({ result: trimmedResult });

    } catch (err) {
        console.error(`An error occurred: ${err}`);
        return res.status(500).json({ error: 'An internal server error occurred' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
