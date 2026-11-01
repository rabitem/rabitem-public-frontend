const ALLOWED_UPDATES = new Set([
	'version-update:semver-minor',
	'version-update:semver-patch',
])

module.exports = async function mergeDependabot ({
	github,
	context,
	core,
	updateType,
	sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
	attempts = 120,
}) {
	if (!ALLOWED_UPDATES.has(updateType)) {
		core.info('This update requires manual review')
		return
	}

	const eventPr = context.payload.pull_request
	const repository = `${context.repo.owner}/${context.repo.repo}`
	const defaultBranch = context.payload.repository.default_branch
	const sha = eventPr.head.sha
	const pullRequest = { ...context.repo, pull_number: eventPr.number }

	for (let attempt = 0; attempt < attempts; attempt++) {
		const { data: pr } = await github.rest.pulls.get(pullRequest)
		if (
			pr.state !== 'open' || pr.draft ||
			pr.user.login !== 'dependabot[bot]' ||
			pr.head.repo?.full_name !== repository ||
			pr.base.ref !== defaultBranch || pr.head.sha !== sha
		) {
			core.info('PR is no longer eligible for automatic merging')
			return
		}

		const { data } = await github.rest.actions.listWorkflowRuns({
			...context.repo,
			workflow_id: 'ci.yml',
			event: 'pull_request',
			branch: pr.head.ref,
			head_sha: sha,
			per_page: 100,
		})
		const run = data.workflow_runs
			.filter((candidate) =>
				candidate.head_sha === sha &&
				candidate.event === 'pull_request' &&
				candidate.head_repository?.full_name === repository,
			)
			.sort((left, right) => right.id - left.id)[0]

		if (run?.status === 'completed') {
			if (run.conclusion !== 'success') {
				core.setFailed(`CI did not pass: ${run.html_url}`)
				return
			}
			const { data: result } = await github.rest.pulls.merge({
				...pullRequest,
				sha,
				merge_method: 'squash',
			})
			if (!result.merged) {
				core.setFailed(result.message)
				return
			}
			core.info(`Merged PR #${pr.number} after CI passed for ${sha}`)
			return
		}

		await sleep(10_000)
	}

	core.setFailed('Timed out waiting for CI; leave the PR open for review')
}
