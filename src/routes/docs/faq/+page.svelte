<script lang="ts">
	import Button from '../../../components/elements/button.svelte';
	import GiBeerBottle from 'svelte-icons/gi/GiBeerBottle.svelte';
	import Icon from '../../../components/elements/icon.svelte';
	type Question = {
		title: string;
		description: string;
	};

	const questions: Question[] = [
		{
			title: 'What happens to my uploaded logs?',
			description:
				"Your uploaded logs are only stored locally in your browser. If you clear your browser cache, they will be deleted. You can share wars with other users by clicking the share button. This will upload the war to Ikusa's servers and generate a link you can share."
		},
		{
			title: 'Is the Ikusa Logger safe to use?',
			description:
				'The application does not send any network data to others. It does not contain any viruses or malware. You can check the entire source code on GitHub.'
		},
		{
			title: 'Will BDO ban me for using the Ikusa Logger?',
			description:
				'The Ikusa Logger does not interact with the game client or server in any way. It only reads the game network. This is should not be a bannable offense. However, I cannot guarantee that you will not be banned. Use at your own risk. The BDO ToS states that only Data Extraction Acts that extract information that have not already been disclosed by the company are not allowed. The Ikusa Logger only extracts information that is already visible to the player in the game chat and combat log.'
		},
		{
			title: 'How can I contribute?',
			description:
				'This project is a hobby project of mine & available on GitHub. If you want to contribute, feel free to create a ticket, join the discord to discuss & leave feedback or message me directly.'
		}
	];
</script>

<div>
	<p class="text-xl font-bold text-gold">Frequently Asked Questions</p>
	<ul>
		{#each questions as question}
			<li class="mt-4">
				<p class="font-bold text-foreground">{question.title}</p>
				<p>{question.description}</p>
			</li>
		{/each}
	</ul>

	<Button href="https://ko-fi.com/O5O6N90L4" target="_blank" class="w-fit mt-2"
		><Icon icon={GiBeerBottle} class="w-6 h-6 mr-1" />
		Buy Me a Fun Drink</Button
	>

	<div class="mt-8">
		Next: <a href="/docs/changelog" class="underline">Changelog</a>
	</div>
</div>
