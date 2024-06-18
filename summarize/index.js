import { PersonalAssistant, UserMessage, INST } from "../../src/personal-assistant/index.js"
import { SystemMessage } from "../../src/personal-assistant/types"

// import {ref} from 'vue'
const server = 'http://localhost:3000'

async function summarize({selector ="", url = ""}) {
  // perhaps use encodeURIComponent(url)
  const resp = await fetch(`${server}/text?selector=${selector}&url=${encodeURIComponent(url)}`)
  return await resp.text()
}

export default async function (app = new PersonalAssistant()) {
  const { state } = app

  // app.use((req, res, next) => {
  //   console.log(req)
  // })

  app.bus.on('function', async e => {
    console.log('function called', e)

})

  const tool = {
    triggers: [
      '> summarize test',
    ],
    async func(args) {
      // Test run
      // const url = 'http://localhost:3000/text?selector=.mw-parser-output&url=https://dune.fandom.com/wiki/Omnius'
      const url = 'https://dune.fandom.com/wiki/Omnius'

      const data = await summarize({
        selector: '.mw-parser-output',
        url
      })
      app.write({content: `summarize: ${data}`, hidden:true, role: 'user'})
      app.invoke()
    }
  }

  app.commands.push(tool)
  state.samples.push(tool.triggers[0])
}


/** @todo */
export const backend = {
  config: {
      model: 'phi3',
      base: "http://localhost:11434"
  }
}

// /**
//  * https://github.com/ollama/ollama/blob/main/examples/typescript-functioncalling/extractemail.ts
//  * @param {*} text 
//  * @returns 
//  */
export async function extract(schema = {}, text = '') {
  const system = `You will be given a text along with a prompt and a schema. You will have to extract the information requested in the prompt from the text and generate output in JSON observing the schema provided. If the schema shows a type of integer or number, you must only show a integer for that field. A string should always be a valid string. If a value is unknown, leave it empty. Output the JSON with extra spaces to ensure that it pretty prints.`;
  const prompt = `Only add data to the mostly appropriate field. Don't make up fields that aren't in the schema. If there isn't a value for a field, use null. Output should be in JSON.
  
  Schema: 
  ${JSON.stringify(schema, null, 2)}
  
  Source Text:
  ${text}`

  const messages = [
      new SystemMessage(system),
      new UserMessage(prompt)
  ]

  // https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-chat-completion
  // see https://github.com/ollama/ollama/blob/main/examples/typescript-functioncalling/extractwp.ts
  const resp = await fetch(`${backend.config.base}/api/chat`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          format: 'json',
          model: "llama3",
          messages,
          stream: false,
          options: {
              seed: 1,
              temperature: 0
          }
      }),
  });
  const data = await resp.json()
  return JSON.parse(data.message.content)
}
