import * as path from 'path';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { nanoid } from 'nanoid';
import * as readline from 'readline';

const contactsPath = path.resolve('db', 'contacts.json');
const backupDir = './backup';

const readContactsFile = async path => {
  try {
    const contactsJson = await readFile(path);
    const contacts = JSON.parse(contactsJson);
    return contacts;
  } catch (err) {
    console.error('Error reading contacts from file: ', err);
    throw new Error(err);
  }
};

const writeContactsFile = async (data, filePath) => {
  try {
    await writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing contacts to file: ', err);
    throw new Error(err);
  }
};

const validateIndex = (input, table) => {
  if (isNaN(input)) {
    console.log('It has to be a number!');

    return false;
  }
  if (input < 0 || input >= table.length) {
    console.log(`The number you chose is not index number`);

    return false;
  }
  return true;
};

export const listContacts = async () => {
  try {
    const contacts = await readContactsFile(contactsPath);
    if (contacts) return contacts;
    return false;
  } catch (err) {
    console.log('Error getting contact list: ', err);
    throw new Error(err);
  }
};

export const getContactById = async contactId => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index === -1 || !contacts) {
      console.log(`There is no contact with id ${contactId} !`);
      return false;
    }
    console.log(new Date(), contacts[index]);
  } catch (err) {
    console.log(`Error getting contact with id ${contactId}: `, err);
    throw new Error(err);
  }
};

export const removeContact = async contactId => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index !== -1 && contacts) {
      contacts.splice(index, 1);
      await writeContactsFile(contacts, contactsPath);
      console.log(new Date(), `Contact with id ${contactId} removed successfully`);
      return;
    }
    console.log(`There is no contact with id ${contactId}`);
  } catch (err) {
    console.log(`Error removing contact with id ${contactId}: `, err);
    throw new Error(err);
  }
};

export const addContact = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const question = prompt => {
    return new Promise(resolve => {
      rl.question(prompt, answer => {
        resolve(answer);
      });
    });
  };
  try {
    const contacts = await listContacts();
    if (contacts) {
      const newContact = {
        id: nanoid(),
        name: '',
        email: '',
        phone: '',
      };

      const answerName = await question(`Enter the name: `);
      if (answerName) {
        newContact.name = answerName;
      }

      const answerEmail = await question(`Enter the e-mail: `);
      if (answerEmail) {
        newContact.email = answerEmail;
      }

      const answerPhone = await question(`Enter phone number: `);
      if (answerPhone) {
        newContact.phone = answerPhone;
      }
      contacts.push(newContact);
      await writeContactsFile(contacts, contactsPath);
      console.log(
        new Date(),
        `Contact ${newContact.name} with email: ${newContact.email} and phone: ${newContact.phone} added successfully`
      );
    }
  } catch (err) {
    console.log('Error adding new contact: ', err);
    throw new Error(err);
  } finally {
    rl.close();
  }
};

export const editContact = async contactId => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const question = prompt => {
    return new Promise(resolve => {
      rl.question(prompt, answer => {
        resolve(answer);
      });
    });
  };

  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    const editContact = contacts[index];
    console.log(`You are editing ${JSON.stringify(editContact, null, 2)}: `);

    const answerName = await question(
      `Put the new name (Hit enter to leave it as ${editContact.name}): `
    );
    if (answerName) {
      editContact.name = answerName;
    }

    const answerEmail = await question(
      `Put the new e-mail (Hit enter to leave it as ${editContact.email}): `
    );
    if (answerEmail) {
      editContact.email = answerEmail;
    }

    const answerPhone = await question(
      `Put the new phone (Hit enter to leave it as ${editContact.phone}): `
    );
    if (answerPhone) {
      editContact.phone = answerPhone;
    }
    contacts[index] = editContact;
    console.log(new Date(), `The new Contact is ${JSON.stringify(contacts[index], null, 2)}`);
    await writeContactsFile(contacts, contactsPath);
  } catch (error) {
    console.error('An error occurred: ', error);
  } finally {
    rl.close();
  }
};

export const retrieveContacts = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const question = prompt => {
    return new Promise(resolve => {
      rl.question(prompt, answer => {
        resolve(answer);
      });
    });
  };
  try {
    let index = null;
    const backupFiles = await readdir(backupDir);
    console.table(backupFiles);
    let indexAnswer = await question(`Choose the index of file you want to backup: `);
    if (!validateIndex(indexAnswer, backupFiles)) {
      indexAnswer = await question(`Choose the index of file you want to backup: `);
    } else {
      index = indexAnswer;
    }
    const selectedFilePath = path.join(backupDir, backupFiles[index]);
    const selectedFile = await readContactsFile(selectedFilePath);
    await writeContactsFile(selectedFile, contactsPath);
    console.log(`The backup contact list has been retrieved from  ${selectedFilePath}`);
  } catch (err) {
    console.error('Error retrieving contact list:', err);
  } finally {
    rl.close();
  }
};

export const createBackup = async () => {
  try {
    const backupContacts = await listContacts();
    const date = new Date();
    const formattedDate = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}_${date
      .getUTCHours()
      .toString()
      .padStart(2, '0')}-${date.getUTCMinutes().toString().padStart(2, '0')}-${date
      .getUTCSeconds()
      .toString()
      .padStart(2, '0')}_UTC`;

    const backupFileName = `backup_${formattedDate}.json`;
    const backupPath = path.join('./backup', backupFileName);
    await writeContactsFile(backupContacts, backupPath);
    console.log(`The backup file ${backupPath} has been successfully created`);
  } catch (err) {
    console.error('Error creating backup', err);
  }
};
