<script lang="ts">
	export let image: string | undefined = undefined;
	export let name: string | undefined = undefined;
	interface $$Props {
		class?: string;
		image?: string;
		name?: string;
	}
</script>

<svg
	width="96"
	height="158"
	viewBox="0 0 96 158"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={$$props.class}
>
	<g filter="url(#filter0_d_201_21)">
		<path
			d="M48.9702 147.445C48.1748 148.286 46.8336 148.279 46.048 147.428L5.00007 103L5.00006 0.999992L90.9999 1L90.9999 103L48.9702 147.445Z"
			fill="#1C1C1C"
		/>
		<path
			d="M4.50007 103L4.50007 103.196L4.63282 103.339L45.6808 147.768C46.6627 148.831 48.3392 148.84 49.3334 147.789L91.3632 103.344L91.4999 103.199L91.4999 103L91.4999 1L91.4999 0.5L90.9999 0.5L5.00006 0.499992L4.50006 0.499992L4.50006 0.999992L4.50007 103Z"
			stroke="#656565"
		/>
	</g>
	<g filter="url(#filter1_d_201_21)">
		<path
			d="M49.0739 137.37C48.2749 138.242 46.8968 138.235 46.1079 137.352L12 99.2162L12 11L84 11L84 99.2162L49.0739 137.37Z"
			fill="#1C1C1C"
		/>
		<path
			d="M11.5 99.2162L11.5 99.4072L11.6273 99.5495L45.7352 137.686C46.7213 138.788 48.4439 138.798 49.4427 137.707L84.3688 99.5538L84.5 99.4105L84.5 99.2162L84.5 11L84.5 10.5L84 10.5L12 10.5L11.5 10.5L11.5 11L11.5 99.2162Z"
			stroke="#656565"
		/>
	</g>
	<rect x="12" y="7" width="72" height="9" fill="#1C1C1C" />
	<path
		d="M45.0014 55.2045V55.0213C45.0218 53.0769 45.2254 51.5296 45.6122 50.3793C45.9991 49.2289 46.5488 48.2975 47.2614 47.5849C47.974 46.8723 48.8291 46.2157 49.8267 45.6151C50.4273 45.2486 50.9669 44.8159 51.4453 44.3171C51.9238 43.8081 52.3004 43.2228 52.5753 42.5611C52.8603 41.8994 53.0028 41.1664 53.0028 40.3622C53.0028 39.3646 52.7687 38.4993 52.3004 37.7663C51.8322 37.0334 51.2061 36.4684 50.4222 36.0714C49.6384 35.6744 48.768 35.4759 47.8111 35.4759C46.9763 35.4759 46.1721 35.6489 45.3984 35.995C44.6248 36.3411 43.9783 36.8858 43.4592 37.6289C42.94 38.372 42.6397 39.3442 42.5582 40.5455H38.7102C38.7917 38.8149 39.2396 37.3337 40.054 36.1019C40.8786 34.8701 41.9627 33.9285 43.3065 33.277C44.6604 32.6255 46.1619 32.2997 47.8111 32.2997C49.6027 32.2997 51.1603 32.656 52.4837 33.3686C53.8172 34.0812 54.8454 35.0585 55.5682 36.3004C56.3011 37.5424 56.6676 38.9574 56.6676 40.5455C56.6676 41.6652 56.4946 42.6781 56.1484 43.5842C55.8125 44.4902 55.3239 45.2995 54.6825 46.0121C54.0514 46.7247 53.2879 47.3558 52.392 47.9055C51.4962 48.4654 50.7785 49.0559 50.239 49.6768C49.6995 50.2876 49.3075 51.0155 49.0632 51.8604C48.8189 52.7054 48.6866 53.759 48.6662 55.0213V55.2045H45.0014ZM46.956 64.2443C46.2027 64.2443 45.5562 63.9746 45.0167 63.435C44.4772 62.8955 44.2074 62.2491 44.2074 61.4957C44.2074 60.7424 44.4772 60.096 45.0167 59.5565C45.5562 59.0169 46.2027 58.7472 46.956 58.7472C47.7093 58.7472 48.3557 59.0169 48.8952 59.5565C49.4348 60.096 49.7045 60.7424 49.7045 61.4957C49.7045 61.9946 49.5773 62.4527 49.3228 62.87C49.0785 63.2874 48.7476 63.6233 48.3303 63.8778C47.9231 64.1222 47.465 64.2443 46.956 64.2443Z"
		fill="#656565"
	/>
	{#if image}
		<image href={image} class="h-16" x="19" y="20" />
	{/if}
	{#if name}
		<text
			x="50%"
			y="55%"
			dominant-baseline="middle"
			text-anchor="middle"
			fill="#b0b0b0"
			font-size="1.3rem"
			font-weight=""
			font-style="monospace"
			font-family="monospace"
		>
			{name}
		</text>
	{/if}
	<defs>
		<filter
			id="filter0_d_201_21"
			x="0"
			y="0"
			width="95.9999"
			height="157.071"
			filterUnits="userSpaceOnUse"
			color-interpolation-filters="sRGB"
		>
			<feFlood flood-opacity="0" result="BackgroundImageFix" />
			<feColorMatrix
				in="SourceAlpha"
				type="matrix"
				values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
				result="hardAlpha"
			/>
			<feOffset dy="4" />
			<feGaussianBlur stdDeviation="2" />
			<feComposite in2="hardAlpha" operator="out" />
			<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
			<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_201_21" />
			<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_201_21" result="shape" />
		</filter>
		<filter
			id="filter1_d_201_21"
			x="7"
			y="10"
			width="82"
			height="137.019"
			filterUnits="userSpaceOnUse"
			color-interpolation-filters="sRGB"
		>
			<feFlood flood-opacity="0" result="BackgroundImageFix" />
			<feColorMatrix
				in="SourceAlpha"
				type="matrix"
				values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
				result="hardAlpha"
			/>
			<feOffset dy="4" />
			<feGaussianBlur stdDeviation="2" />
			<feComposite in2="hardAlpha" operator="out" />
			<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
			<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_201_21" />
			<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_201_21" result="shape" />
		</filter>
	</defs>
</svg>
