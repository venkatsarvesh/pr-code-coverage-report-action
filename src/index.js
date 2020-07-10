import { promises as fs } from "fs"
import * as core from "@actions/core"
import * as github from "@actions/github"

import { parse } from "./lcov"
import { diff } from "./comment"

async function main() {

	const lcovFile = core.getInput("lcov-file") || "./coverage/lcov.info"
	const baseFile = core.getInput("lcov-base")
	const token = core.getInput("github-token")
	const githubOctokit = new github.getOctokit(token)


	const raw = await fs.readFile(lcovFile, "utf-8").catch(err => null)
	if (!raw) {
		console.log(`No coverage report found at '${lcovFile}', exiting...`)
		return
	}

	const baseRaw =
		baseFile && (await fs.readFile(baseFile, "utf-8").catch(err => null))
	if (baseFile && !baseRaw) {
		console.log(`No coverage report found at '${baseFile}', ignoring...`)
	}

	const options = {
		repository: github.context.payload.repository.full_name,
		commit: github.context.payload.pull_request.head.sha,
		prefix: `${process.env.GITHUB_WORKSPACE}/`,
		head: github.context.payload.pull_request.head.ref,
		base: github.context.payload.pull_request.base.ref,
	}

	const lcov = await parse(raw)
	const baselcov = baseRaw && (await parse(baseRaw))
	const body = diff(lcov, baselcov, options)

	await githubOctokit.issues.createComment({
		repo: github.context.repo.repo,
		owner: github.context.repo.owner,
		issue_number: github.context.payload.pull_request.number,
		body: diff(lcov, baselcov, options),
	});
}

main().catch(function (err) {
	console.log(err)
	core.setFailed(err.message)
})
