// import { PersonalAssistant, UserMessage, INST } from "@/personal-assistant/index.js"

export default async function (app) {
    const { state } = app

    const WeatherCard = {
        template: `
        <div>
            <img src='https://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/neerslagradar/WWWRADAR_loop.gif'>
        </div>`
    }

    const tool = {
        triggers: [
            '> weather',
        ],
        async func(args) {
            app.write({
                component: WeatherCard
            })
        }
    }

    app.commands.push(tool)
    state.samples.push(tool.triggers[0])
}

export const plugin = {
    description: 'A simple weather plugin',
}
