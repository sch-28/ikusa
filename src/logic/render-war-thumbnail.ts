import chromium from 'chrome-aws-lambda';
import { supabase } from './supabase';

export async function render_preview(url: string, id: string) {
	const browser = await chromium.puppeteer.launch({
		args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
		defaultViewport: chromium.defaultViewport,
		executablePath: await chromium.executablePath,
		headless: true,
		ignoreHTTPSErrors: true
	});
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
