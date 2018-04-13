/*
 * Copyright 2018 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const debug = require('debug')('example fetch')


const { import:usage } = require('../usage'),
	fs = require('fs-extra'),
	localPath = `~/Documents/ShellProjects`,
	$ = require('jquery'),
	git = require('simple-git')()


const doList = (_a, _b, fullArgv, modules, rawCommandString, _2, argvWithoutOptions, dashOptions) => {

	console.log(fullArgv, modules, rawCommandString, _2, argvWithoutOptions, dashOptions)
	return new Promise((resolve, reject) => {
		if(argvWithoutOptions.length === 3){
			let url = argvWithoutOptions[2],
				name = dashOptions['name'] || url.split('/').find(e => e.endsWith('.git')).slice(0, -4)

			name = name.toLowerCase();
			
			let filePath = require('expand-home-dir')(localPath)+'/'+name

			fs.ensureDir(localPath, err => {
				if(err)
					reject(err)
				// for local testing only. must provide a name
				if(url.indexOf('http') === -1){
					console.log('copy locally')
					url = require('expand-home-dir')(url);
					
					fs.copy(url, filePath)
					  .then(() => {
					  	console.log('yesss');
					  	let message = `Example ${name} is cloned to ${localPath}/${name}. `
					  	fs.readJSON(`${filePath}/shellConfig.js`, (err, obj) => {
					  		console.log(err, obj);
							if(err){
								obj = {};
								message += `<br/>To deploy the example, use <a onclick="repl.pexec('example deploy ${name}')">example deploy ${name}</a>`
							}
							else{
								message += `<br/>Use <a onclick="repl.pexec('example config ${name}')">example config ${name}</a> to configurate the example before deploying.`
							}
							obj.projectName = name
							fs.writeJSON(`${filePath}/shellConfig.js`, obj).then(() => resolve($(`<div>${message}</div>`)[0])).catch(err => reject(err))

						});

					  })
					  .catch(err => {console.error(err); reject(err)})
				}
				else{
					git.clone(url, filePath, (err, result) => {					
						if(err){
							console.error(err)
							if(err.indexOf('already exists and is not an empty directory')){
								err += `Remove the directory or use --name to provide a project name that is not '${name}'.`
							}
							reject(err)
						}

						let message = `Example ${name} is cloned to ${localPath}/${name}. `
						fs.readJSON(`${filePath}/shellConfig.js`, (err, obj) => {
							if(err){
								obj = {};
								message += `To deploy the example, use <a onclick="repl.pexec('example deploy ${name}')">example deploy ${name}</a>`
							}
							else{
								message += `Use <a onclick="repl.pexec('example config ${name}')">example config ${name}</a> to configurate the example before deploying.`
							}
							obj.projectName = name
							fs.writeJSON(`${filePath}/shellConfig.js`, obj).then(() => resolve($(`<div>${message}</div>`)[0])).catch(err => reject(err))

						});
					});
				}
			});
			
		}
		else{
			reject('Usage: example import <GitRepoUrl> [--localPath path]')
		}
	});
	


    
}

module.exports = (commandTree, prequire) => {
    commandTree.listen('/example/import', doList, { usage })
}
