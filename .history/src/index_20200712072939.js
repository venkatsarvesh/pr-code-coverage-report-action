import { promises as fs } from "fs"
import core from "@actions/core"
import { GitHub, context } from "@actions/github"

import { parse } from "./lcov"
import { diff } from "./comment"

async function main() {
    const token = core.getInput("github-token")
    const lcovFile = core.getInput("lcov-file") || "./coverage/lcov.info"
    const baseFile = core.getInput("lcov-base")

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
        repository: context.payload.repository.full_name,
        commit: context.payload.pull_request.head.sha,
        prefix: `${process.env.GITHUB_WORKSPACE}/`,
        head: context.payload.pull_request.head.ref,
        base: context.payload.pull_request.base.ref,
    }

    const lcov = await parse(raw)
    const baselcov = baseRaw && (await parse(baseRaw))
    const body = diff(lcov, baselcov, options)

    await new GitHub(token).issues.createComment({
        repo: context.repo.repo,
        owner: context.repo.owner,
        issue_number: context.payload.pull_request.number,
        body: diff(lcov, baselcov, options),
    })
}

main().catch(function (err) {
    console.log(err)
    core.setFailed(err.message)
})