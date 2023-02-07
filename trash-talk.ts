//import fetch from 'node-fetch';
import axios from "axios";
export async function generateTrashTalk(phrase: string): Promise<string | null> {

    try {
        const resp = await axios.post(
            'https://vontell.steamship.run/rg-ctf-trash-talker/rg-ctf-trash-talker/generate ',
            {phrase},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer E3D48BD0-36C2-423E-B419-FC0D5552B4E7'
                }
            }
        )
        return resp.data;
    } catch (e) {
        console.log(e)
    }

    return null;

}