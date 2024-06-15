// TODO save as message-X

function debounce(fn, delay = 1000) {
    let timer
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}

const SOURCE_KEY = 'finals'
const STORAGE_KEY = 'finals'

export default async function (app, { watch }) {
    const { state } = app
    
    const saveDebounced = debounce((messages = []) => {
        // console.log('SAVE')
        keep(messages)
    })
  
    function keep(messages = []) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }

    watch(() => state[SOURCE_KEY], e => {
        saveDebounced(state[SOURCE_KEY])
    }, { deep: true })

    function restore() {
        const messages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        state[SOURCE_KEY] = messages
    }
    restore()
}

export const plugin = {
    description: 'Plugin that syncs messages to local storage',
    author: 'Jelle'
}