import { PersonalAssistant, Attachment, AssistantMessage } from "@/personal-assistant/index"

export default async function (app = new PersonalAssistant) {
    app.state.samples.push(`Tell something about me?`)

    const memory = app.memory('profile', {})
    // console.log(memory)
    // console.log('profile ready')
    // app.bus.on('memory/ready', e=> {
    //     console.log('cool')
    // })

    if (!memory.profile) {
        app.write(new AssistantMessage(`Let's introduce. Tell me something about you?`))
        //  You can also drop in a file like 'profile_information.json'.
    }
    if (memory.profile) {
        app.write(`Welcome back ${memory.profile.name}`)
    }
    
    app.bus.on('FileList', async function (fileList) {
        // Get first file
        const file = fileList[0]

        if (file.name === 'profile_information.json') {
            const text = await readAsTextFile(file)
            const data = JSON.parse(text)
            // console.log(data)

            if(!data.profile?.name) {
                app.write({
                    content: `Sorry wrong file`,
                    role: 'assistant',
                })
                return
            }

            app.write({
                content: `I see you are ${data.profile.name}`,
                role: 'assistant',
                attachments: [
                    new Attachment({
                        // https://developer.mozilla.org/en-US/docs/Web/API/File
                        type: file.type,
                        name: file.name,
                        size: file.size,
                        content: data
                    })
                ]
            })

            // Keep in memory
            memory.profile = data.profile

            const message = app.write({
                content: `Hereby a brief summary about you in a few sentence.`,
                role: 'assistant',
                streaming: true
            })

            console.log(app)
            
            app.backend.pipeTo(message)
        }
    })
}

export const plugin = {
    description: 'Plugin to build up profile information',
    author: 'Jelle'
}


function readAsTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const fileContents = reader.result;
            resolve(fileContents)
        };

        reader.readAsText(file);
        // reader.readAsArrayBuffer(file)
    })
};