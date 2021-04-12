import { query } from 'faunadb'
import getVideoId from 'get-video-id'
import { client } from './_client'

const { Paginate, Match, Index, Call, Function: Fn } = query

export default async function (req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  console.log(req.body)
  const { id } = getVideoId(req.body.video)

  let docs
  try {
    docs = await client.query(
      Paginate(Match(Index('reports_of_video'), Call(Fn('getVideo'), id)))
    )
  } catch (error) {
    res.status(500).send(error)
  } finally {
    res.status(200).send(docs)
  }
}
