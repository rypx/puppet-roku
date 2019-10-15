'use strict'

const Request = require('request-promise')
const Puppeteer = require('puppeteer-core')

const StartTest = async () => {
	let BrowserSocket = await Request.get({ uri: `http://127.0.0.1`, json: true })
	console.log(BrowserSocket)
	let Browser = await Puppeteer.connect({
		browserURL: BrowserSocket.url
	})
	
	let Page = await Browser.newPage()
	await Page.goto('https://google.com/')
	console.log(Page)
	await Page.close()

	if ( !Page.isClosed() ) {
		await Page.close()
		await Browser.disconnect()
	} else
		await Browser.disconnect()
}

(async () => {
	await StartTest()
})()