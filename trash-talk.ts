//import fetch from 'node-fetch';
import axios from "axios";
export async function generateTrashTalk(phrase: string): Promise<string> {

    const resp = await axios.post(
        'https://vontell.steamship.run/rg-ctf-trash-talker/rg-ctf-trash-talker/generate',
        {
            body: JSON.stringify({phrase}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer E3D48BD0-36C2-423E-B419-FC0D5552B4E7'
            }
        }
    )

    return JSON.stringify(resp.data);

}