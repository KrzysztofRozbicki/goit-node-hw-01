import { Command } from 'commander';

import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  retrieveContacts,
} from './contacts.js';

const program = new Command();

program
  .option('-a, --action <type>', 'choose action')
  .option('-i, --id <type>', 'user id')
  .option('-n, --name <type>', 'user name')
  .option('-e, --email <type>', 'user email')
  .option('-p, --phone <type>', 'user phone');

program.parse(process.argv);

const argv = program.opts();

const invokeAction = async ({ action, id, name, email, phone }) => {
  const contacts = await listContacts();

  switch (action) {
    case 'list':
      console.log(contacts);
      break;

    case 'get':
      const index = await getContactById(id);
      if (index) console.log(contacts[index]);
      break;

    case 'add':
      addContact(name, email, phone);
      break;

    case 'remove':
      removeContact(id);
      break;

    case 'backup':
      retrieveContacts();
      break;

    default:
      console.warn(`\x1B[31m Unknown action type: ${action}`);
  }
};

invokeAction(argv);
