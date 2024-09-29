Here's the updated README with the `clsp` field in place of `clvm_code`, reflecting the correct behavior of the API.

---

### CLVM Execution Environment

This project provides a Dockerized Node.js Express server that accepts Chialisp (CLSP) code and parameters via a `POST` request, compiles the code into CLVM bytecode using Chia Dev Tools, and then runs the bytecode on the Chialisp Virtual Machine (CLVM) using `brun`.

### Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoint](#api-endpoint)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

### Features
- Compile Chialisp code dynamically using `run`.
- Execute compiled Chialisp code on the CLVM using `brun`.
- Accept input via a REST API endpoint.
- Built with Node.js, TypeScript, and Express.
- Containerized for easy deployment with Docker.

### Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Requirements

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/en/) (Optional for development purposes)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd clvm-execution-env
   ```

2. **Build the Docker container**:
   Make sure Docker is installed and running on your machine, then build the Docker image using the provided Dockerfile.
   ```bash
   docker build -t clvm-execution-env .
   ```

3. **Run the Docker container**:
   Once the image is built, you can run the container using the following command:
   ```bash
   docker run -p 3000:3000 clvm-execution-env
   ```

   This will expose the service on port `3000` of your local machine.

### Usage

Once the container is running, you can make `POST` requests to the API endpoint to compile and execute Chialisp code.

### API Endpoint

#### `POST /run-chialisp`

This endpoint accepts Chialisp (CLSP) code and parameters in the request body and returns the result of running the compiled CLVM bytecode using `brun`.

- **Endpoint**: `/run-chialisp`
- **Method**: `POST`
- **Content-Type**: `application/json`

##### Request Body Format:

```json
{
  "clsp": "(mod (number) (defun factorial (number) (if (> number 1) (* number (factorial (- number 1))) 1)) (factorial number))",
  "params": ["5"]
}
```

- `clsp`: The Chialisp code (CLSP) to be compiled and run.
- `params`: (Optional) The parameters to pass to the compiled CLVM code, formatted as an array of strings.

##### Example Request:

```bash
curl -X POST http://localhost:3000/run-chialisp \
-H "Content-Type: application/json" \
-d '{
  "clsp": "(mod (number) (defun factorial (number) (if (> number 1) (* number (factorial (- number 1))) 1)) (factorial number))",
  "params": ["5"]
}'
```

##### Example Response:

```json
{
  "result": "120"
}
```

### Environment Variables

You can customize the behavior of the container using environment variables. The following environment variables are supported:

| Variable      | Default | Description                                       |
| ------------- | ------- | ------------------------------------------------- |
| `PORT`        | `3000`  | The port on which the Express server will listen. |

### Contributing

If you wish to contribute to this project:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Feel free to open issues to report bugs or request features.

### License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Now, the `clsp` field correctly indicates that the API accepts and runs Chialisp code. Let me know if you need any other changes or additions!