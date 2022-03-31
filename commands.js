const db = require('./database/connection');
const puppetter = require('puppeteer');
const api = require('./service/api');

module.exports = {

    async comandos() {
        const command = db.collection('command');
        const result = await command.where('active', '==', 'sim').get()

        return result;
    },

    async addComands(user, command, content, mark) {
        if (user != 'lector133' && user != 'KiLLUAgg7' && user != 'twmateus67') {
            return "Usuário não permitido";
        } else if (command == '') {
            return "Informe o nome do comando";
        } else if (content == '') {
            return "Informe o que o bot deve retornar";
        } else {
            const data = {
                name: command,
                message: content,
                active: 'sim',
                mark: mark
            }

            var message = '';

            try {
                await db.collection('command').add(data)
                message = 'Comando adicionado';
            } catch (error) {
                message = 'Ocorreu um erro';
            }

            return message;
        }
    },

    async editCommand(user, name, content) {
        if (user != 'lector133' && user != 'KiLLUAgg7' && user != 'twmateus67') {
            return "Usuário não permitido";
        } else if (name == '') {
            return "Informe o nome do comando";
        } else {
            const all = db.collection('command');
            const comando = await all.where('name', '==', name).get();

            var message = '';

            if (comando.empty) {
                message = "Comando não encontrado";
            }

            const values = comando.docChanges().map(actions => {
                return actions.doc.data()
            })

            let names = ""
            let marks = ""
            let actives = ""

            values.forEach(data => {
                names = data.name,
                    marks = data.mark,
                    actives = data.active
            })


            const teste = comando.docChanges().map(actions => {
                return actions.doc.ref.id;
            })

            const convert = JSON.stringify(teste);
            const convert2 = convert.replace(/[\])}[{(]/g, '');
            try {
                const editar = db.collection('command').doc(convert2.replace(/"/g, ''));

                await editar.set({
                    name: names,
                    message: content,
                    mark: marks,
                    active: actives
                });

                message = "Comando editado"
            } catch (error) {
                message = "Ocorreu um erro ao editar o comando"
            }

            return message;

        }
    },

    async removeCommand(user, name) {
        if (user != 'lector133' && user != 'KiLLUAgg7' && user != 'twmateus67') {
            return "Usuário não permitido";
        } else if (name == '') {
            return "Informe o nome do comando";
        } else {
            const all = db.collection('command');
            const comando = await all.where('name', '==', name).get();

            var message = '';

            if (comando.empty) {
                message = "Comando não encontrado";
            }

            const teste = comando.docChanges().map(actions => {
                return actions.doc.ref.id;
            })

            const convert = JSON.stringify(teste);
            const convert2 = convert.replace(/[\])}[{(]/g, '');
            try {
                await db.collection('command').doc(convert2.replace(/"/g, '')).delete();

                message = "Comando removido"
            } catch (error) {
                message = "Ocorreu um erro ao remover o comando"
            }

            return message;
        }
    },

    async apiYoutube() {
       const response = await api.get('part=snippet&channelId=UCnPP0v72iLlfABNsZQoko0Q&order=date&key=AIzaSyDzrk-0KfAfJkjTCwFv5dBOhjHjAVquA10');

       return response.data.items[0].id.videoId;
    },

    async eventGenshin() {
        const browser = await puppetter.launch();
        const page = await browser.newPage();
        await page.goto('https://genshin.hoyoverse.com/pt/news', {
            waitUntil: 'load',
        });

        const categorys = await page.$$('ul.category > li:nth-child(4)');


        await categorys[0].click();

        await page.waitForTimeout(1000)


        const data = await page.evaluate(() => {
            return {
                url_post: {
                    "link": document.getElementsByClassName('news__title news__content ellipsis')[0].href,
                    "frase": document.getElementsByClassName('news__title news__content ellipsis')[0].textContent
                }
            }
        });

        await browser.close();

        return data.url_post
    },

    async infoGenshin() {
        const browser = await puppetter.launch();
        const page = await browser.newPage();
        await page.goto('https://genshin.hoyoverse.com/pt/news', {
            waitUntil: 'load',
        });

        const categorys = await page.$$('ul.category > li:nth-child(2)');


        await categorys[0].click();

        await page.waitForTimeout(1000)


        const data = await page.evaluate(() => {
            return {
                url_post: {
                    "link": document.getElementsByClassName('news__title news__content ellipsis')[0].href,
                    "frase": document.getElementsByClassName('news__title news__content ellipsis')[0].textContent
                }
            }
        });

        await browser.close();

        console.log(data.url_post)

        return data.url_post
    },

    onConnectedHandler(addr, port) {
        console.log(`* Conectado em ${addr}:${port}`);
    },

    bencao() {
        var caracteres = 'SNSNSNSNSNSNSNSNSNSNSNSNSNSNSNSNSNSNSN';
        stringAleatoria = caracteres.charAt(Math.floor(Math.random() * caracteres.length));

        let result = "";

        if (stringAleatoria == 'S') {
            result = `Você vai pegar sim CoolCat`;
        } else if (stringAleatoria == 'N') {
            result = "IHHHHH, acho que é um tiro e um sonho NotLikeThis";
        }

        return result;
    },

    puxar_url(urll) {
        return urll;
    },

    async url_video1() {
        const browser = await puppetter.launch(
            {
                'args': [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            }
        );
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto('https://www.youtube.com/c/KiLLUAgg7/videos');

        const video = await page.evaluate(() => {
            return {
                url_video: document.querySelector('a#video-title').href
            }
        });

        await browser.close();

        const video_url = video.url_video;

        url = this.puxar_url(video_url);

        return url;
    },
}