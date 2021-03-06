#!/usr/bin/env node

import chalk from 'chalk';
import Commander from 'commander';
import packageJson from './package.json';
import { validateNpmName } from './helpers/validate-pkg';
import path from 'path';
import prompts from 'prompts';
import { getPkgManager } from './helpers/get-pkg-manager';
import { createApp, DownloadError } from './create-app';
import checkForUpdate from 'update-check';

let projectPath = '';

const program = new Commander.Command(packageJson.name)
	.version(packageJson.version)
	.arguments('<project-directory>')
	.usage(`${chalk.green('<project-directory>')} [options]`)
	.action(name => {
		projectPath = name;
	})
	.option(
		'--swc',
		`
	  Initialize the project with SWC for compiler.
	`,
	)
	.option(
		'--ncc',
		`
	  Initialize the project with @vercel/ncc for compiler.
	`,
	)
	.option(
		'--use-npm',
		`
  	Explicitly tell the CLI to bootstrap the app using npm
	`,
	)
	.option(
		'--use-yarn',
		`
  	Explicitly tell the CLI to bootstrap the app using yarn
	`,
	)
	.option(
		'--use-pnpm',
		`
  	Explicitly tell the CLI to bootstrap the app using pnpm
	`,
	)
	.option(
		'-e, --example [name]|[github-url]',
		`
	  An example to bootstrap the app with. You can use an example name
	  from the official create-tsconfig-app repo or a GitHub URL. The URL can use
	  any branch and/or subdirectory
	`,
	)
	.option(
		'--example-path <path-to-example>',
		`
	  In a rare case, your GitHub URL might contain a branch name with
	  a slash (e.g. bug/fix-1) and the path to the example (e.g. foo/bar).
	  In this case, you must specify the path to the example separately:
	  --example-path foo/bar
	`,
	)

	.allowUnknownOption()
	.parse(process.argv);

async function run() {
	if (typeof projectPath === 'string') {
		projectPath = projectPath.trim();
	}

	if (!projectPath) {
		const res = await prompts({
			type: 'text',
			name: 'path',
			message: 'What is your project named?',
			initial: 'my-app',
			validate(name) {
				const validation = validateNpmName(path.basename(path.resolve(name)));
				if (validation.valid) {
					return true;
				}

				return 'Invalid project name: ' + validation.problems![0];
			},
		});

		if (typeof res.path === 'string') {
			projectPath = res.path.trim();
		}
	}

	if (!projectPath) {
		console.log(
			'\nPlease specify the project directory:\n' +
				`  ${chalk.cyan(program.name())} ${chalk.green(
					'<project-directory>',
				)}\n` +
				'For example:\n' +
				`  ${chalk.cyan(program.name())} ${chalk.green('my-ts-app')}\n\n` +
				`Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`,
		);
		process.exit(1);
	}

	const resolvedProjectPath = path.resolve(projectPath);
	const projectName = path.basename(resolvedProjectPath);

	const { valid, problems } = validateNpmName(projectName);

	if (!valid) {
		console.error(
			`Could not create a project called ${chalk.red(
				`"${projectName}"`,
			)} because of npm naming restrictions:`,
		);

		problems!.forEach(p => console.error(`    ${chalk.red.bold('*')} ${p}`));
		process.exit(1);
	}

	const packageManager = program.useNpm
		? 'npm'
		: program.usePnpm
		? 'pnpm'
		: getPkgManager();

	const example = typeof program.example === 'string' && program.example.trim();
	try {
		await createApp({
			appPath: resolvedProjectPath,
			packageManager,
			example: example && example !== 'default' ? example : undefined,
			examplePath: program.examplePath,
			swc: program.swc,
			ncc: program.ncc,
		});
	} catch (reason) {
		if (!(reason instanceof DownloadError)) {
			throw reason;
		}

		const res = await prompts({
			type: 'confirm',
			name: 'builtin',
			message:
				`Could not download "${example}" because of a connectivity issue between your machine and GitHub.\n` +
				'Do you want to use the default template instead?',
			initial: true,
		});
		if (!res.builtin) {
			throw reason;
		}

		await createApp({
			appPath: resolvedProjectPath,
			packageManager,
			swc: program.swc,
			ncc: program.ncc,
		});
	}
}

const update = checkForUpdate(packageJson).catch(() => null);

async function notifyUpdate(): Promise<void> {
	try {
		const res = await update;
		if (res?.latest) {
			const pkgManager = getPkgManager();
			console.log(
				chalk.yellow.bold('A new version of `create-ts-app` is available!') +
					'\n' +
					'You can update by running: ' +
					chalk.cyan(
						pkgManager === 'yarn'
							? 'yarn global add create-ts-app'
							: `${pkgManager} install --global create-ts-app`,
					) +
					'\n',
			);
		}

		process.exit();
	} catch {
		// ignore error
	}
}

run()
	.then(notifyUpdate)
	.catch(async reason => {
		console.log();
		console.log('Aborting installation.');
		if (reason.command) {
			console.log(`  ${chalk.cyan(reason.command)} has failed.`);
		} else {
			console.log(
				chalk.red('Unexpected error. Please report it as a bug:') + '\n',
				reason,
			);
		}

		console.log();

		await notifyUpdate();

		process.exit(1);
	});
