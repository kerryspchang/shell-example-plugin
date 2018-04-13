/*
 * Copyright 2017-18 IBM Corporation
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

const usagePerCommand = require('./usage')

const toUsage = (models, { commandPrefix, title, docs, breadcrumb=title }) => {
    const usage = {
        breadcrumb,
        title,
        docs,
        example: `${commandPrefix} <command>`,
        commandPrefix,
        available: [],
        //nRowsInViewport: 4 // the default is 3, but we have 4, so just show them all
    }

    for (let command in models) {
        usage.available.push(models[command])
    }

    return usage
}

module.exports = ((commandTree, prequire) => {
    console.log('here');

    commandTree.subtree('/example', {
        usage: toUsage(usagePerCommand, {
            commandPrefix: 'example',
            title: 'Using Github Examples',
            docs: 'Commands for using Composition examples on Github',
        })
    })

    require('./lib/import')(commandTree, prequire)
    require('./lib/config')(commandTree, prequire)
    require('./lib/deploy')(commandTree, prequire)
    require('./lib/undeploy')(commandTree, prequire)
    require('./lib/describe')(commandTree, prequire)
})
