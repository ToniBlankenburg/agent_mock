import readline from 'readline';
import {chat, Message} from './utils/chat';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const history: Message[] = [];
rl.on('line', (message) => {
  chat(message, history).then((response: string) => {
    history.push({ role: "user", text: message });
    history.push({ role: "model", text: response });
    console.log(response);
  });
});
