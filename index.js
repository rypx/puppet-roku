'use strict'

const Express = require('express')
const Puppeteer = require('puppeteer')

process.on('rejectionHandled', (err) => {
	console.error(err)
	setTimeout(() => process.exit(), 1000)
})

process.on('uncaughtException', (err) => {
	console.error(err)
	setTimeout(() => process.exit(), 1000)
})

process.on('unhandledRejection', (err) => {
	console.error(err)
	setTimeout(() => process.exit(), 1000)
})

const StartBrowser = async () => {
	let Browser
	let WSEndpoint = ''

	try {
		Browser = await Puppeteer.launch({
			ignoreHTTPSErrors: true,
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--ignore-certifcate-errors',
				'--ignore-certifcate-errors-spki-list',
				'--user-agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36"'
			]
		})

		WSEndpoint = Browser.wsEndpoint()
	} catch (err) {
		throw new Error(err)
	}

	return [WSEndpoint, Browser]
}

const StartServer = async () => {
	let Browser = await StartBrowser()

	// idk if this worked or not.
	Browser[1].on('disconnected', (e) => {
		process.exit()
	})

	return Express()
		.all('/', (req, res) => {
			res.json({
				ws: Browser[0].replace('127.0.0.1', req.hostname),
				url: `http://` + Browser[0].replace('127.0.0.1', req.hostname).split('/')[2]
			})
		})
		.listen(process.env.PORT || 80 || 3000, () => console.log('[ # ] Server is Online.'))
}

(async () => {
	await StartServer()
})()