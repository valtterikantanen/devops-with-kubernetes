import { randomUUID } from 'crypto';

const randomString = randomUUID();

function getCurrentStatus() {
  return `${new Date().toISOString()}: ${randomString}`;
}

function logRandomString() {
  console.log(getCurrentStatus());
  setTimeout(logRandomString, 5000);
}

logRandomString();
