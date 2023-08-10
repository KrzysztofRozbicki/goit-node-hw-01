import * as path from 'path';
import { readFile, writeFile } from 'node:fs/promises';
import { nanoid } from 'nanoid';

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
  const contacts = await readContactsFile();
  if (contacts) return contacts;
  return false;
};

export const getContactById = async contactId => {
  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === contactId);
  if (index === -1 && contacts) {
    console.log(`There is no contact with id ${contactId} !`);
    return false;
  }
  return index;
};

export const removeContact = async contactId => {
  const contacts = await listContacts();
  const index = await getContactById(contactId);
  if (index && contacts) {
    contacts.splice(index, 1);
    await writeContactsFile(contacts);
    console.log(`Contact with id ${contactId} removed successfully`);
  }
};

export const addContact = async (name, email, phone) => {
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
