import chromium from 'chrome-aws-lambda';
import { supabase } from '../../../logic/supabase';
import type { RequestHandler } from '@sveltejs/kit';
import { dev } from '$app/environment';
export const config = {
	runtime: 'edge'
};

export const POST: RequestHandler = async (event) => {
	const { url, id } = await event.request.json();

	try {
		const browser = await chromium.puppeteer.launch({
			args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
			defaultViewport: chromium.defaultViewport,
			executablePath: dev ? undefined : await chromium.executablePath,
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
		if (!war_container) return new Response('Unable to load webpage', { status: 500 });
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
			return new Response(JSON.stringify(error), { status: 500 });
		}
	} catch (e) {
		console.error(e);
		return new Response(JSON.stringify(e), { status: 500 });
	}

	return new Response(null, { status: 200 });
};
