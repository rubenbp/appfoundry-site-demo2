import { execFileSync } from 'node:child_process';
import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
	const onVercel = process.env.VERCEL === '1';
	const sha = onVercel
		? process.env.VERCEL_GIT_COMMIT_SHA
		: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
	if (!sha || !/^[a-f0-9]{40}$/.test(sha)) {
		throw new Error('Build requires a full commit SHA. Enable Vercel system environment variables for Git deployments.');
	}
	const dirty = !onVercel && execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim().length > 0;
	return Response.json({ sha, dirty });
};
