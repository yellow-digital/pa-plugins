import {RadioMessage} from "./RadioMessage.js"

export default async function (app) {
  const { state } = app
  // state.systems.push(`if the user asks for play radio then respond with: ok '_PLAYRADIO'.`)
  // state.systems.push(`if the user asks for other song then response with: ok, lets do that _PLAYNEXT`)
  // state.systems.push(`if the user asks it likes this song then response with: ok _RADIOLIKE`)
  state.samples.push(`Play a song`)
  // state.samples.push(`Play other song`)
  // state.samples.push(`I like this song`)

  const _state = {
    currentStation: {}
  }

  const memory = app.memory('radio', {})

  // app.bus.on('ready', async e => {
  //   console.log(e)

  //   if (e.rawContent.includes('_PLAYRADIO')) {
  //     const stations = await loadStations()

  //     const station = stations[Math.floor(Math.random() * stations.length)];
  //     play(station)
  //   }

  //   if (e.rawContent.includes('_PLAYNEXT')) {
  //     const stations = await loadStations()
  //     const station = stations[Math.floor(Math.random() * stations.length)];
  //     play(station)
  //   }


  //   // if(e.rawContent.includes('_RADIOLIKE')) {
  //   //   // memory.
  //   // }
  // })

  const tool = {
    triggers: [
      '> play random station',
    ],
    async func(args) {
      // const stations = await loadStations()
      // const station = stations[Math.floor(Math.random() * stations.length)];
      // play(station)

      state.finals.push({
        role: 'system',
        content: `Playing radio`,
        component: RadioMessage 
      })
    }
  }

  app.commands.push(tool)
  state.samples.push(tool.triggers[0])
}

