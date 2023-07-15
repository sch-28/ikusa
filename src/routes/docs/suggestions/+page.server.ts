import { prisma } from '../../../logic/prisma';

export type Suggestion = {
	content: string;
	time: Date;
	title: string;
	userId: string;
	likes: number;
	id: string;
	status: string;
};

export async function load({ depends }) {
	depends('suggestions');
	const suggestions = await prisma.suggestion.findMany({
		select: {
			_count: {
				select: {
					liked_by: true
				}
			},
			content: true,
			time: true,
			title: true,
			userId: true,
			id: true,
			status: true
		}
	});

	const mapped_suggestions = suggestions.map((suggestion) => ({
		content: suggestion.content,
		time: suggestion.time,
		title: suggestion.title,
		userId: suggestion.userId,
		likes: suggestion._count.liked_by,
		id: suggestion.id,
		status: suggestion.status
	}));

	return {
		suggestions: mapped_suggestions
	};
}
