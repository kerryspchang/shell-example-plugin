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

/** breadcrumb parents */
const parents = [{ command: 'example' }]

/** required parameter: name of installed plugin */
//const installedPlugin = [{ name: 'plugin', docs: 'the name of an installed plugin', entity: 'plugin' }]

/**
 * Usage model for example commands
 *
 */
exports.import = {
    strict: 'import',
    command: 'import',
    breadcrumb: 'import an example from Github',
    docs: 'import an example composition app from Github',
    example: 'example import <GitCloneUrl>',
    required: [{name: 'GitCloneUrl', docs: 'URL for doing a git clone', entity: 'example', file: true}],
    optional: [{ name: '--name', docs: 'Example name. Default is the git repo name.' }], // to make tab completion happy
    //related: ['plugin install', 'plugin list'],
    parents
}

exports.describe = {
    strict: 'describe',
    command: 'describe',
    breadcrumb: 'describe the project\'s usage',
    docs: 'describe the project\'s usage, such as its input and output data',
    example: 'example describe <exampleName>',
    required: [{name: 'exampleName', docs: 'Name of an example'}],
    //related: ['plugin install', 'plugin list'],
    parents
}

exports.config = {
    strict: 'config',
    command: 'config',
    breadcrumb: 'configurate an example',
    docs: 'configurate an example before deploying, such as setting up credentials',
    example: 'example config <exampleName>',
    required: [{name: 'exampleName', docs: 'Name of an exapmle' }], // to make tab completion happy
    //related: ['plugin install', 'plugin list'],ple.', entity: 'example'}],
    //optional: [{ name: '--name', docs: 'Example name. 
    parents
}

exports.deploy = {
    strict: 'deploy',
    command: 'deploy',
    breadcrumb: 'deploy an example',
    docs: 'deploy an example',
    example: 'example deploy <exampleName>',
    required: [{name: 'exampleName', docs: 'Name of an exapmle' }], // to make tab completion happy
    //related: ['plugin install', 'plugin list'],ple.', entity: 'example'}],
    //optional: [{ name: '--name', docs: 'Example name. 
    parents
}

exports.undeploy = {
    strict: 'undeploy',
    command: 'undeploy',
    breadcrumb: 'undeploy an example',
    docs: 'undeploy an example',
    example: 'example undeploy <exampleName>',
    required: [{name: 'exampleName', docs: 'Name of an exapmle' }], // to make tab completion happy
    //related: ['plugin install', 'plugin list'],ple.', entity: 'example'}],
    //optional: [{ name: '--name', docs: 'Example name. 
    parents
}


