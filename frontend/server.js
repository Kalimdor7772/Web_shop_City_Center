import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";
import next from "next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT || 3000);
const certDir = process.env.SSL_CERT_DIR || path.join(__dirname, "certs");
const keyFile = process.env.SSL_KEY_FILE || path.join(certDir, "localhost.key");
const certFile = process.env.SSL_CERT_FILE || path.join(certDir, "localhost.crt");

if (!fs.existsSync(keyFile) || !fs.existsSync(certFile)) {
    console.error("HTTPS certificate files not found.");
    console.error("Create certificates in frontend/certs or set SSL_KEY_FILE and SSL_CERT_FILE.");
    process.exit(1);
}

const httpsOptions = {
    key: fs.readFileSync(keyFile),
    cert: fs.readFileSync(certFile),
};

const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    https.createServer(httpsOptions, (req, res) => {
        return handle(req, res);
    }).listen(port, () => {
        console.log(`> HTTPS server ready on https://localhost:${port}`);
    });
}).catch((error) => {
    console.error(error);
    process.exit(1);
});
