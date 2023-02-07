//import fetch from 'node-fetch';
import axios from "axios";
export async function generateTrashTalk(phrase: string): Promise<string> {

    try {
        const resp = await axios.post(
            'https://vontell.steamship.run/rg-ctf-trash-talker/rg-ctf-trash-talker/generate',
            {
                body: {phrase},
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer E3D48BD0-36C2-423E-B419-FC0D5552B4E7'
                }
            }
        )
        return JSON.stringify(resp.data);
    } catch (e) {
        console.log(e)
        return `Failed with: ${JSON.stringify(e)}`
    }


}