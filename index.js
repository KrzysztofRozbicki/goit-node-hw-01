import { Command } from 'commander';

import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  retrieveContacts,
  editContact,
  createBackup,
} from './contacts.js';

const program = new Command();

program.option('-a, --action <type>', 'choose action').option('-i, --id <type>', 'user id');

program.parse(process.argv);

const argv = program.opts();
const invokeAction = async ({ action, id, name, email, phone }) => {
  try {
    switch (action) {
      case 'list':
        const contacts = await listContacts();
        console.log(new Date());
        console.table(contacts);
        break;

      case 'get':
        await getContactById(id);
        break;

      case 'add':
        await addContact();
        break;

      case 'remove':
        await removeContact(id);
        break;

      case 'edit':
        await editContact(id);
        break;

      case 'backup':
        await retrieveContacts();
        break;

      case 'save':
        await createBackup();
        break;

      default:
        console.warn(`\x1B[31m Unknown action type: ${action}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

invokeAction(argv);

const validateIndex = (input, table) => {
  if (isNaN(value)) {
    console.log('It has to be a number!');

    return false;
  }
  if (value < 0 || value >= table.length) {
    console.log(`The number you chose is not index number`);

    return false;
  }
  return true;
};
