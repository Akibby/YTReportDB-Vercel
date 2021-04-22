import { query } from 'faunadb';
import getVideoId from 'get-video-id';
import { client } from './_client';
import { addUser, addVideo, authenticate } from './_support';
// import { authenticate } from './_withAuth'

const { Create, Collection, Call, Function: Fn } = query;

export default async function (req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  console.log(
    'payload',
    'Video:',
    req.body.video,
    '\nStatus:',
    req.body.status,
    '\nUser:',
    req.body.user,
    '\n'
  );
  const { id } = getVideoId(req.body.video);

  const videoById = await client
    .query(Call(Fn('getVideo'), id))
    .catch(() => addVideo(id));

  const userByName = await client
    .query(Call(Fn('getUser'), req.body.user))
    .catch(() => addUser(req.body.user));

  const hasAuth = await authenticate(req.body.user);
  console.log(
    'Video Ref:',
    videoById,
    '\nUser Ref:',
    userByName,
    '\nUser Status:',
    hasAuth
  );
  if (hasAuth) {
    const data = {
      video: videoById,
      user: userByName,
      status: req.body.status,
    };
    console.log(data);
    const doc = await client.query(Create(Collection('reports'), { data }));
    res.status(200).json({ doc }).end();
  } else {
    console.log(req.body.user, 'is banned');
    res.status(401).end();
  }
}
