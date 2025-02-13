import type { Command } from '../types';
import { InvalidUsageError } from '../types';

const MIN_MESSAGES = 1;
const MAX_MESSAGES = 10;

const prune: Command = {
  name: 'prune',
  description: 'prune?',
  permissions: 'ADMINISTRATOR',
  args: 'required',
  async execute(msg, [howMany]) {
    // tslint:disable-next-line:no-magic-numbers
    const num = Number.parseInt(howMany, 10);

    if (!Number.isFinite(num)) {
      throw new InvalidUsageError('Parametr musi być liczbą wiadomości.');
    }
    if (num < MIN_MESSAGES) {
      throw new InvalidUsageError(`Musisz podać przynajmniej ${MIN_MESSAGES}.`);
    }
    if (num > MAX_MESSAGES) {
      throw new InvalidUsageError(
        `Ze względów bezpieczeństwa, możesz usunąć tylko ${MAX_MESSAGES} wiadomości na raz.`,
      );
    }

    await msg.delete();
    if (msg.channel.type !== 'dm') {
      const messages = await msg.channel.messages.fetch({ limit: num });
      await msg.channel.bulkDelete(messages);
    }
    return null;
  },
};

export default prune;
