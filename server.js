const http = require('http');
const https = require('https');
const fs = require('fs');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
	key: fs.readFileSync('./cert/privkey.pem'),
	cert: fs.readFileSync('./cert/fullchain.pem'),
};

app.prepare().then(() => {
	// HTTPS server
	https
		.createServer(httpsOptions, (req, res) => {
			handle(req, res);
		})
		.listen(443, (err) => {
			if (err) throw err;
			console.log('> Ready on https://web.sd-projects.uk');
		});

	// HTTP server that redirects to HTTPS
	http.createServer((req, res) => {
		res.writeHead(301, {
			Location: `https://${req.headers.host}${req.url}`,
		});
		res.end();
	}).listen(80, (err) => {
		if (err) throw err;
		console.log('> Redirecting HTTP to HTTPS');
	});
});
