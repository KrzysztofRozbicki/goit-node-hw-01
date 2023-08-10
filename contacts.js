import * as path from 'path';
import { readFile } from 'node:fs/promises';
import { nanoid } from 'nanoid';
import { Command } from 'commander';

const contactsPath = path.resolve('db', 'contacts.json');

console.log(contactsPath);

export const listContacts = async () => {
  try {
    const contactsJson = await readFile(contactsPath);
    const contacts = JSON.parse(contactsJson);
    return contacts;
  } catch (err) {
    console.log(err);
    return;
  }
};

export const getContactById = async contactId => {
  const contacts = await listContacts();
  const foundContact = contacts.find(contact => contact.id === contactId);
  if (!foundContact) {
    console.log(`There is no contact with id ${contactId} !`);
    return;
  }
  console.log(foundContact);
};

export const removeContact = contactId => {
  console.log(`This is Remove Contact with id ${contactId}`);
  // ...twój kod
};

export const addContact = (name, email, phone) => {
  console.log(`This is Add Contact with name ${name} , email ${email} and phone ${phone}`);
  // ...twój kod
};
