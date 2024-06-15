import { PersonalAssistant } from '../../src/personal-assistant/index'

export default async function (
    app = new PersonalAssistant
) {
    const { state, bus, backend } = app

    bus.on('ready', e => {
        console.log(e)
    })
}

export const plugin = {
    description: 'This plugin shows some debug info in the console',
    author: 'Jelle'
}