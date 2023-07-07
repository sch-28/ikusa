import { PUBLIC_IKUSA_API } from '$env/static/public';

export class PlayerQueue {
	private static queue: string[] = [];
	private static interval: number | null = null;

	public static fetch_player(name: string) {
		!this.queue.includes(name) && this.queue.push(name);

		if (!this.interval) {
			this.interval = setInterval(() => {
				if (this.queue.length > 0) {
					const name = this.queue.shift();
					fetch(PUBLIC_IKUSA_API + '/api/player', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ name, region: 'EU' })
					});
				}

				if (this.queue.length === 0 && this.interval) {
					clearInterval(this.interval);
					this.interval = null;
				}
			}, 100);
		}
	}
}
