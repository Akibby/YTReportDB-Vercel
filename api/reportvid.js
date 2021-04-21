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
  console.log(req.body);
  console.log(req.body.user);
  const { id } = getVideoId(req.body.video);

  const videoById = await client
    .query(Call(Fn('getVideo'), id))
    .catch(() => addVideo(id));

  const userByName = await client
    .query(Call(Fn('getUser'), req.body.user))
    .catch(() => addUser(req.body.user));

  console.log('💃 Video Ref is ', videoById);
  console.log('🙂 User Ref is ', userByName);
  if (authenticate(req.body.user)) {
    const data = {
      video: videoById,
      user: userByName,
      status: req.body.status,
    };
    console.log(data);
    const doc = await client.query(Create(Collection('reports'), { data }));
    res.status(200).json({ doc });
  } else {
    res.status(401);
  }
}
