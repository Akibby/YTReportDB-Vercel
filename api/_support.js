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
  console.log(videoRef);
  return videoRef;
}

export async function addClient(clientid) {
  const data = {
    name: clientid,
    valid: true,
  };

  const doc = await client.query(Create(Collection('users'), { data }));
  const userRef = await client.query(Call(Fn('getUser'), username));
  return true;
}

export async function addUser(username) {
  const data = {
    name: username,
    email: 'test@example.com',
    valid: true,
  };

  const doc = await client.query(Create(Collection('users'), { data }));
  const userRef = await client.query(Call(Fn('getUser'), username));
  console.log(userRef);
  return userRef;
}

export async function authenticate(clientid) {
  const validity = await client
    .query(Paginate(Match(Index('validity_by_name'))))
    .catch(() => addUser(clientid));
  console.log('The status of Client:', clientid, ' is ', validity);
  return validity;
}
