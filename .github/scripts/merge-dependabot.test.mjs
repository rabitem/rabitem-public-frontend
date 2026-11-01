import assert from 'node:assert/strict'
import { test } from 'node:test'
import mergeDependabot from './merge-dependabot.cjs'

function fixture () {
	const pr = {
		number: 42,
		state: 'open',
		draft: false,
		user: { login: 'dependabot[bot]' },
		head: {
			sha: 'tested-head',
			ref: 'dependabot/npm_and_yarn/minor-and-patch',
			repo: { full_name: 'rabitem/rabitem-public-frontend' },
		},
		base: { ref: 'main' },
	}
	const run = {
		id: 10,
		head_sha: 'tested-head',
		event: 'pull_request',
		head_repository: { full_name: 'rabitem/rabitem-public-frontend' },
		status: 'completed',
		conclusion: 'success',
		html_url: 'https://github.com/example/ci/10',
	}
	const merges = []
	const failures = []
	const runs = [run]
	const options = {
		context: {
			repo: { owner: 'rabitem', repo: 'rabitem-public-frontend' },
			payload: {
				pull_request: structuredClone(pr),
				repository: { default_branch: 'main' },
			},
		},
		updateType: 'version-update:semver-patch',
		attempts: 2,
		sleep: async () => {},
		core: {
			info: () => {},
			setFailed: (message) => failures.push(message),
		},
		github: {
			rest: {
				pulls: {
					get: async () => ({ data: pr }),
					merge: async (request) => {
						merges.push(request)
						return { data: { merged: true } }
					},
				},
				actions: {
					listWorkflowRuns: async () => ({
						data: { workflow_runs: runs },
					}),
				},
			},
		},
	}
	return { options, pr, run, runs, merges, failures }
}

for (const type of ['minor', 'patch']) {
	test(`merges a verified ${type} update with passing CI`, async () => {
		const { options, merges, failures } = fixture()
		options.updateType = `version-update:semver-${type}`
		await mergeDependabot(options)
		assert.equal(merges.length, 1)
		assert.equal(merges[0].sha, 'tested-head')
		assert.equal(merges[0].merge_method, 'squash')
		assert.deepEqual(failures, [])
	})
}

for (const type of ['version-update:semver-major', '', undefined]) {
	test(`leaves ${String(type)} updates for manual review`, async () => {
		const { options, merges } = fixture()
		options.updateType = type
		await mergeDependabot(options)
		assert.deepEqual(merges, [])
	})
}

const ineligibleChanges = {
	'head changed while waiting': (pr) => { pr.head.sha = 'new-head' },
	'human-authored PR': (pr) => { pr.user.login = 'someone-else' },
	'fork PR': (pr) => { pr.head.repo.full_name = 'someone-else/fork' },
	'non-default target': (pr) => { pr.base.ref = 'release' },
	'draft PR': (pr) => { pr.draft = true },
	'closed PR': (pr) => { pr.state = 'closed' },
}

for (const [scenario, change] of Object.entries(ineligibleChanges)) {
	test(`does not merge: ${scenario}`, async () => {
		const { options, pr, merges } = fixture()
		change(pr)
		await mergeDependabot(options)
		assert.deepEqual(merges, [])
	})
}

for (const conclusion of ['failure', 'cancelled', 'skipped', 'timed_out']) {
	test(`leaves PR open when CI is ${conclusion}`, async () => {
		const { options, run, merges, failures } = fixture()
		run.conclusion = conclusion
		await mergeDependabot(options)
		assert.deepEqual(merges, [])
		assert.equal(failures.length, 1)
	})
}

test('waits for CI rather than merging before it starts', async () => {
	const { options, runs, run, merges, failures } = fixture()
	runs.length = 0
	options.sleep = async () => {
		assert.deepEqual(merges, [])
		runs.push(run)
	}
	await mergeDependabot(options)
	assert.equal(merges.length, 1)
	assert.deepEqual(failures, [])
})

test('ignores success for a previous commit', async () => {
	const { options, run, merges, failures } = fixture()
	run.head_sha = 'previous-head'
	await mergeDependabot(options)
	assert.deepEqual(merges, [])
	assert.equal(failures.length, 1)
})

test('uses the latest CI run, including a failing rerun', async () => {
	const { options, run, runs, merges, failures } = fixture()
	runs.push({ ...run, id: 11, conclusion: 'failure' })
	await mergeDependabot(options)
	assert.deepEqual(merges, [])
	assert.equal(failures.length, 1)
})

test('reports a merge rejected by GitHub', async () => {
	const { options, failures } = fixture()
	options.github.rest.pulls.merge = async () => ({
		data: { merged: false, message: 'Branch is protected' },
	})
	await mergeDependabot(options)
	assert.deepEqual(failures, ['Branch is protected'])
})
