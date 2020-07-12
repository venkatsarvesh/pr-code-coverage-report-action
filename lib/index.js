"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const core = require("@actions/core");
/* import { parse } from "./lcov"
import { diff } from "./comment" */
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        /* const token = core.getInput("github-token")
        const lcovFile = core.getInput("lcov-file") || "./coverage/lcov.info"
        const baseFile = core.getInput("lcov-base") */
        let lcovFile = "./lcov.info";
        const raw = yield fs_1.promises.readFile(lcovFile, "utf-8").catch(err => null);
        if (!raw) {
            console.log(`No coverage report found at '${lcovFile}', exiting...`);
            return;
        }
        /*
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
            }) */
    });
}
main().catch(function (err) {
    console.log(err);
    core.setFailed(err.message);
});
