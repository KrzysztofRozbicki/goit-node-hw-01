import * as path from 'path';
import { readFile, writeFile } from 'node:fs/promises';
import { nanoid } from 'nanoid';
import * as readline from 'readline';

const contactsPath = path.resolve('db', 'contacts.json');
const backupContactsPath = path.resolve('backup', 'contacts.json');

const readContactsFile = async () => {
  try {
    const contactsJson = await readFile(contactsPath);
    const contacts = JSON.parse(contactsJson);
    return contacts;
  } catch (err) {
    console.error('Error reading contacts from file: ', err);
    throw new Error(err);
  }
};

const writeContactsFile = async data => {
  try {
    await writeFile(contactsPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing contacts to file: ', err);
    throw new Error(err);
  }
};

export const listContacts = async () => {
  try {
    const contacts = await readContactsFile();
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
    if (index === -1 && contacts) {
      console.log(`There is no contact with id ${contactId} !`);
      return false;
    }
    console.log(contacts[index]);
  } catch (err) {
    console.log(`Error getting contact with id ${contactId}: `, err);
    throw new Error(err);
  }
};

export const removeContact = async contactId => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index && contacts) {
      contacts.splice(index, 1);
      await writeContactsFile(contacts);
      console.log(`Contact with id ${contactId} removed successfully`);
    }
  } catch (err) {
    console.log(`Error removing contact with id ${contactId}: `, err);
    throw new Error(err);
  }
};

export const addContact = async (name, email, phone) => {
  try {
    const contacts = await listContacts();
    if (contacts) {
      const newContact = {
        id: nanoid(),
        name: name,
        email: email,
        phone: phone,
      };
      contacts.push(newContact);
      await writeContactsFile(contacts);
      console.log(
        `Contact ${newContact.name} with email: ${newContact.email} and phone: ${newContact.phone} added successfully`
      );
    }
  } catch (err) {
    console.log('Error adding new contact: ', err);
    throw new Error(err);
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
    console.log(`The new Contact is ${JSON.stringify(contacts[index], null, 2)}`);
    await writeContactsFile(contacts);
  } catch (error) {
    console.error('An error occurred: ', error);
  } finally {
    rl.close();
  }
};

export const retrieveContacts = async () => {
  try {
    const originalContacts = await readFile(backupContactsPath);
    await writeFile(contactsPath, originalContacts);
    console.log('Backup of contact list retrieved.');
  } catch (err) {
    console.error('Error reseting contact list:', err);
  }
};
