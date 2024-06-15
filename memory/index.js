import { PersonalAssistant } from '../../src/personal-assistant/index'

export default async function (
    app = new PersonalAssistant
) {
    const { state, bus, backend } = app

    const memoryClearTool = {
        name: "calendar",
        triggers: [
            'clear memory'
        ],
        description: "Handle calendar.",
        // schema: '{ when, location, description }',
        async func(args) {
            state.memory = []
        }
    }

    app.commands.push(memoryClearTool)
    state.samples.push('clear memory')
}
