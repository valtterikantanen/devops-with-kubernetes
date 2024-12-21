import os from 'os';
import axios from 'axios';
import { connect, JSONCodec } from 'nats';

const { NATS_SERVER, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, NODE_ENV } = process.env;

const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

const inProduction = NODE_ENV === 'production';

async function start() {
  const nc = await connect({ servers: NATS_SERVER });
  const jc = JSONCodec();
  const podName = os.hostname();

  const sub = nc.subscribe('todo-events', { queue: 'broadcaster_group' });

  console.log('Broadcaster service is running and subscribed to todo-events');

  for await (const msg of sub) {
    try {
      const data = jc.decode(msg.data);
      const { type, payload } = data;
      const header = type === 'todo_created' ? '*A todo was created*' : '*A todo was updated*';
      const body = `\`\`\`\n${JSON.stringify(payload, null, 2)}\`\`\``;
      const broadcaster = `Broadcasted by: \`${podName}\``;
      const message = `${header}\n${body}\n${broadcaster}`;

      if (inProduction) {
        await axios.post(TELEGRAM_API_URL, {
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'MarkdownV2',
        });
        console.log('Message forwarded to Telegram successfully.');
      } else {
        console.log('Message:', message);
      }
    } catch (err) {
      console.error('Failed to process message:', err);
    }
  }
}

start().catch(err => {
  console.error('Failed to start broadcaster:', err);
  process.exit(1);
});
