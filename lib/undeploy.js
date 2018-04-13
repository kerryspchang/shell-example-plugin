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


const { undeploy:usage } = require('../usage'),
	fs = require('fs-extra'),
	localPath = require('expand-home-dir')(`~/Documents/ShellProjects`)


const doList = (_a, _b, fullArgv, modules, rawCommandString, _2, argvWithoutOptions, dashOptions) => {

	console.log(fullArgv, modules, rawCommandString, _2, argvWithoutOptions, dashOptions)
	return new Promise((resolve, reject) => {
		let name = argvWithoutOptions[2],
			projectPath = localPath+'/'+name,
			promiseArray = []

		promiseArray.push(repl.qexec(`! kubectl delete -f ${projectPath}/secret.yaml`))
		promiseArray.push(repl.qexec(`! kubectl delete -f ${projectPath}/seedDeploy.yaml`))
		promiseArray.push(repl.qexec(`app delete ${name}/app`))

		Promise.all(promiseArray).then(values => {
			resolve('ok');
		}).catch(err => {
			reject(err)
		})
	});
	


    
}

module.exports = (commandTree, prequire) => {
    commandTree.listen('/example/undeploy', doList, { usage })
}
