import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

const systemChrome = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	reporter: 'list',
	use: {
		baseURL: 'http://127.0.0.1:4173',
		trace: 'retain-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				...(existsSync(systemChrome) ? { launchOptions: { executablePath: systemChrome } } : {}),
			},
		},
	],
	webServer: {
		command: 'python3 -m http.server 4173 --bind 127.0.0.1 --directory dist',
		url: 'http://127.0.0.1:4173',
		reuseExistingServer: false,
		timeout: 30_000,
	},
});
