import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		title: 'Ikusa | BDO Combat Analyzer',
		description:
			'Ikusa is a powerful tool that allows you to analyze your Black Desert Online logs and gain valuable insights into your combat performance.'
	};
};
