<svelte:head>
	<meta http-equiv="refresh" content="1; url='/'" />
</svelte:head>

<div class="wrapper">
	<div class="has-text-centered">
		<h1>Redirecting..</h1>
	</div>
	<a href="/" class="button is-primary">Take me back</a>
</div>

<style>
	.wrapper {
		height: calc(100% - 72px);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 10px;
		padding-bottom: 200px;
	}

	h1 {
		color: white !important;
        margin-bottom: 20px;
	}
</style>
