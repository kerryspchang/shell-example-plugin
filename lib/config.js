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


const { config:usage } = require('../usage'),
	fs = require('fs-extra'),
	localPath = require('expand-home-dir')('~/Documents/ShellProjects'),
	$ = require('jquery'),
	base64 = require('base-64'),
	YAML = require('yamljs'),
	sidecarContainerId = 'shellConfigContainer',
	sidecarContentId = 'shellConfigContent',
	sidecarWebviewId = 'shellConfigWebview';

const cleanup = () => {ui.toggleSidecar(); $(`#${sidecarContainerId}`).remove();};

const generateForm = (configObj, resolve, reject) => {
	let message = '';
	console.log(configObj);
	Object.keys(configObj).forEach(key => {
		if(typeof(configObj[key]) !== 'object') return;
		let {instructions, required, source, input} = configObj[key], item = '';
		if(instructions)
			item += `<div class="configSourceIns">${instructions}</div>`
		if(source)
			item += `<div class="configSourceLinks">Click <a source-url="${source}"><u>here</u></a> to view its webpage.</div>`
		if(input){
			item += '<div>'
			input.forEach(i => {
				item += `${i.label}: <input type="text" class="shellConfigInput" secret-name="${i.name}" secret-required=${required}"/> <br/>`
			})
			item += '</div>'
		}

		if(item.length != 0)
			message += `<li class="configItems"><span class="configItemTitle">${key}</span><br/>${item}</li>`;
	})
	console.log(message);
	let okButton = $('<button type="button">OK</button>'), cancelButton = $('<button type="button">Cancel</button>')
	okButton.click(() => {
		try{
			let secret = {};
			$('.shellConfigInput').each((index, element) => {
				let secrentName = $(element).attr('secret-name'), secretValue = $(element).val() || ''
				secretValue = base64.encode(secretValue)	// base64 encode
				secret[secrentName] = secretValue
			});

			let yamlString = YAML.stringify({
				apiVersion: 'v1',
				kind: 'Secret',
				metadata: {
					name: `${configObj.projectName}-secret`
				},
				data: secret
			}, 4);

			fs.writeFile(`${localPath}/${configObj.projectName}/secret.yaml`, yamlString)			
			.then(() => {
				resolve($(`<div>Configuration completed. ${configObj.deployMsg}</div>`)[0]);	
				cleanup();			
			})
			.catch(e => {reject(e); cleanup();	});
		}
		catch(e){reject(e)};
	});	

	cancelButton.click(() => {
		reject('Configuration canceled.')
		cleanup();
	})

	let container = $(`<div id="${sidecarContainerId}"><div id="${sidecarContentId}"><div id="shellConfigTitle"><div>${configObj.projectName}</div>This project uses the following resources. Follow the instructions below to configure and confirm the use of the resources. </div><ul>${message}</ul><div id="configButtons"></div></div><div id="configWebviewContainer"><div id="webviewSource"></div><webview id="${sidecarWebviewId}"></webview></div></div>`);
	$(container).find('a').each((index, element) => {		
		$(element).click(() => {
			$(`#${sidecarContentId}`).css('height', '40%');
			$(`#${sidecarWebviewId}`).attr('src', $(element).attr('source-url'));
			$('#webviewSource').html(`source: ${$(element).attr('source-url')}`);
			$('#configWebviewContainer').css('display', 'block');
		})
	});
	$(container).find(`#configButtons`).append(cancelButton).append(okButton);
	ui.showCustom({content: $(container)[0], sidecarHeader: false})
}

const doList = (_a, _b, fullArgv, modules, rawCommandString, _2, argvWithoutOptions, dashOptions) => {

	console.log(fullArgv, modules, rawCommandString, _2, argvWithoutOptions, dashOptions)
	return new Promise((resolve, reject) => {
		const name = argvWithoutOptions[2],
			projectPath = localPath+'/'+name,
			deployMsg = `Use <a onclick="repl.pexec('example deploy ${name}')"><u>example deploy ${name}</u></a> to deploy the example.`

			fs.readJSON(`${projectPath}/shellConfig.js`).then(obj => {
				let keys = Object.keys(obj);
				if(keys.length === 1 && keys[0] === 'projectName'){
					resolve($(`<div>The example does not require any configurations. ${deployMsg}</div>`)[0])
				}				
				else{					
					obj.deployMsg = deployMsg;
					generateForm(obj, resolve, reject);
				}

			}).catch(err => { console.error(err); reject(err); })
	});	
    
}

module.exports = (commandTree, prequire) => {	
    ui.injectCSS(__dirname+'/../style/main.css');
    commandTree.listen('/example/config', doList, { usage })
}
