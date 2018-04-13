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


const { deploy:usage } = require('../usage'),
	fs = require('fs-extra'),
	localPath = require('expand-home-dir')('~/Documents/ShellProjects'),
	$ = require('jquery')

const write = obj => fs.writeJSON(`${projectPath}/shellConfig.js`, obj);

const doList = (_a, _b, fullArgv, modules, rawCommandString, _2, argvWithoutOptions, dashOptions) => {

	console.log(fullArgv, modules, rawCommandString, _2, argvWithoutOptions, dashOptions)
	return new Promise((resolve, reject) => {
		const name = argvWithoutOptions[2],
			projectPath = localPath+'/'+name,
			namespace = $('#openwhisk-namespace').html();
		
		// first, deploy secret
		fs.pathExists(`${projectPath}/secret.yaml`)
		.then(exist => {
			if(exist)
				return repl.qexec(`! kubectl apply -f ${projectPath}/secret.yaml`)
			else 
				return Promise.resolve()
		})
		.then(() => fs.readFile(`${projectPath}/seed.yaml`))
		.then(data => fs.writeFile(`${projectPath}/seedDeploy.yaml`, data.toString().split('${projectName}').join(name)))
		.then(() => repl.qexec(`! kubectl apply -f ${projectPath}/seedDeploy.yaml`))
		.then(() => fs.readFile(`${projectPath}/composition.js`))
		.then(data => fs.writeFile(`${projectPath}/compositionDeploy.js`, data.toString().split('${projectName}').join(name).split('${namespace}').join(namespace)))
		.then(() => repl.qexec(`app update ${name}/app ${projectPath}/compositionDeploy.js`))
		.then(() => resolve($(`<div>Success. The deploy app is called <a onclick="repl.pexec('app get ${name}/app')"><u>${name}/app<u></a></div>`)[0]))
		.catch(reject)

	});	
    
}

module.exports = (commandTree, prequire) => {
    commandTree.listen('/example/deploy', doList, { usage })
}
