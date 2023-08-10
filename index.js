import { Command } from 'commander';

import { listContacts, getContactById, removeContact, addContact } from './contacts.js';

const program = new Command();

program
  .option('-a, --action <type>', 'choose action')
  .option('-i, --id <type>', 'user id')
  .option('-n, --name <type>', 'user name')
  .option('-e, --email <type>', 'user email')
  .option('-p, --phone <type>', 'user phone');

program.parse(process.argv);

const argv = program.opts();

const invokeAction = ({ action, id, name, email, phone }) => {
  switch (action) {
    case 'list':
      console.log(listContacts());

      break;

    case 'get':
      getContactById(id);
      break;

    case 'add':
      addContact({ name, email, phone });
      break;

    case 'remove':
      removeContact(id);
      break;

    default:
      console.warn(`\x1B[31m Unknown action type: ${action}`);
  }
};

invokeAction(argv);
