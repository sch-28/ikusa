import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import { supabase } from './supabase';

export async function render_preview(url: string, id: string) {
	const options = process.env.AWS_REGION
    ? {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless
      }
    : {
        args: [],
        executablePath:
          process.platform === 'win32'
            ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            : process.platform === 'linux'
            ? '/usr/bin/google-chrome'
            : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      };
  const browser = await puppeteer.launch(options);
	const page = await browser.newPage();
	await page.setViewport({
		width: 1200,
		height: 628
	});
	await page.goto(url, { waitUntil: 'networkidle0' });
	const war_container = await page.$('.mt-16');
	if (!war_container) return;
	const buffer = await war_container.screenshot({ type: 'png' });
	await browser.close();

	const { data, error } = await supabase.storage
		.from('war-thumbnails')
		.upload(`${id}.png`, buffer, {
			cacheControl: '3600',
			upsert: true
		});

	if (error) {
		console.error(error);
	}

	return data;
}
