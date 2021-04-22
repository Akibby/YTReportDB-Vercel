import { query } from 'faunadb';
import { client } from './_client';

const {
  Paginate,
  Match,
  Index,
  Create,
  Collection,
  Call,
  Function: Fn,
} = query;

export async function addVideo(videoId) {
  const data = {
    videoID: videoId,
  };

  const doc = await client.query(Create(Collection('videos'), { data }));
  const videoRef = await client.query(Call(Fn('getVideo'), videoId));
  return videoRef;
}

export async function addClient(clientid) {
  const data = {
    name: clientid,
    valid: true,
  };

  const doc = await client.query(Create(Collection('users'), { data }));
  const validity = await client.query(Call(Fn('getValidity'), clientid));
  return validity;
}

export async function addUser(username) {
  const data = {
    name: username,
    email: 'test@example.com',
    valid: true,
  };

  const doc = await client.query(Create(Collection('users'), { data }));
  const userRef = await client.query(Call(Fn('getUser'), username));
  return userRef;
}

export async function authenticate(clientid) {
  const validity = await client
    .query(Call(Fn('getValidity'), clientid))
    .catch(() => {
      addClient(clientid);
    });
  return validity;
}
