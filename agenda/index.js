import { PersonalAssistant, SystemMessage, UserMessage, newMessage } from '../../src/personal-assistant/index'
import { extract } from "@/personal-assistant/llm"
import { createToolPrompt } from '@/personal-assistant/prompts'

export default async function (
  app = new PersonalAssistant
) {
  const { state, bus, backend } = app

  state.systems.push(createToolPrompt(`remember something or has a meeting`, 'todo'))
  // state.systems.push(createToolPrompt(`retrieve a task, any task today`, 'retrieve'))

  state.samples.push(`remember I have a meeting today at 1pm`)
  state.samples.push(`remember meeting tomorrow at 4pm with John at the office`)
  // state.samples.push(`remember I have a meeting today at 1pm and 4pm`)
  state.samples.push(`Any tasks today?`)
  state.samples.push(`First upcoming task?`)


  const memory = app.memory('agenda', [])

  bus.on('function', async e => {
    // console.log('function called', e)

    if (e.name === 'retrieve') {
      console.log(e)
      tool.func()
    }

    if (e.name === 'todo') {
      const message = newMessage({
        role: 'system',
        content: `parsing...${e.args[0]}`,
      })
      app.write(message)
      message.streaming = true

      // Extraction
      const extraction = await extract(eventSchema, e.args[0])
      console.log(extraction)

      message.streaming = false

      memory.push({
        extraction,
        raw: e.args[0],
      })

      app.write({
        role: 'system',
        content: `added to memory. clearing chat in 3 seconds.`,
        attachments: [
          { type: 'json', data: extraction }
        ]
      })

      // We are done
      setTimeout(() => {
        app.clear()
      }, 3000)
    }
  })


  /**
 * Commands
 */
  const CalendarCard = {
    // markRaw: true,
    data: () => ({
      memory
    }),
    template: `
    <ul>
      <li v-for="task in memory">
        {{task.extraction.date}}:
        {{task.extraction.time}} -
        {{task.extraction.with}}
        <p v-if="task.extraction.location">
          {{\`https://duckduckgo.com/?q=\${task.extraction.location}&iaxm=maps\`}}
          <a :href='\`https://duckduckgo.com/?q=\${task.extraction.location}&iaxm=maps\`'>{{task.extraction.location}}</a>
        </p>
      </li>
    </ul>`
  }

  const tool = {
    name: "calendar",
    triggers: [
      'list calendar',
    ],
    description: "Handle calendar.",
    async func(args) {
      app.write({
        component: CalendarCard
      })

      // memory.forEach(task => {
      //   app.write(new SystemMessage(`Meeting: ${task.raw}`))
      // })
    }
  }

  app.commands.push(tool)
  state.samples.push(tool.triggers[0])

  // app.write(new UserMessage('Any tasks today?'))
  // app.invoke()
  // tool.func()
}

const eventSchema = {
  where: {
    "type": "string",
    "description": "Location of the event"
  },
  date: {
    "type": "string",
    "description": `Date of the event. Format: YYYY-MM-DD. Today is ${new Date().toISOString().split('T')[0]}`
  },
  // isToday: {
  //   "type": "boolean",
  //   "description": "is today"
  // },
  time: {
    "type": "string",
    "description": "Time of the event"
  },
  with: {
    type: "string",
  }
}
