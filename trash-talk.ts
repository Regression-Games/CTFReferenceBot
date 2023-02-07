//import fetch from 'node-fetch';
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
export async function generateTrashTalk(phrase: string): Promise<string> {

    const resp = await fetch(
        'https://vontell.steamship.run/rg-ctf-trash-talker/rg-ctf-trash-talker/generate',
        {
            method: 'POST',
            body: JSON.stringify({phrase}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer E3D48BD0-36C2-423E-B419-FC0D5552B4E7'
            }
        }
    )

    return JSON.stringify(resp.body);

}