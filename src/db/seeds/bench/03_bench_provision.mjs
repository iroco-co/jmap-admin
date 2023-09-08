import * as sha512 from 'sha512-crypt-ts'
import fs from "fs/promises";

const NB_USERS=100
const DOMAIN_ID=1

export const seed = async (knex) => {
  const domain = await knex('virtual_domain').select('*').where("id", DOMAIN_ID).first();
  let users = []
  for (let i = 0; i<NB_USERS; i++) {
    const padded_number = String(i).padStart(3, '0')
    users.push({email: `bench_${padded_number}@${domain.name}`, password: randomSalt(), role: 2, vdomain_id: DOMAIN_ID})
  }
  let hashed_users = users.map((u) => {
    return {email: u.email, password: hashPassword(u.password), role: u.role, vdomain_id: u.vdomain_id}
  });
  await knex('user').insert(hashed_users);
  await fs.writeFile('user.csv', getContent(users))
};

function getContent(users) {
  return users.reduce((acc, user) => `${acc}${user.email},${user.password}\n`, '')
}
function hashPassword(password) {
  const payload = sha512.sha512.crypt(password, randomSalt())
  return `{SHA512-CRYPT}${payload}`
}
function randomSalt() {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ./';
  const length = 8 + Math.random() * 8;
  let result = '';
  for (let i = length; i > 0; --i) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return result;
}