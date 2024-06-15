export default async function ({state}) {
    // state.systems.push(`the user name is John`)

    state.samples.push(`What is my name?`)
    state.samples.push(`What 5 + 5?`)
    state.samples.push(`What is the capitol of France?`)
    state.samples.push(`Try it`)
    state.samples.push(`Summarize the text`)
    state.samples.push(`what have we spoken about?`)
    state.samples.push(`Tell me something about me`)
    state.samples.push(`Fibonacci`)
}

export const plugin = {
    name: 'welcome',
    description: 'Plugin to welcome the user',
}