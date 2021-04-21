import { query } from 'faunadb'
import { client } from './_client'
import { addUser } from './_support'

const { Paginate, Match, Index, Call, Function: Fn } = query

function authenticate(clientid) {
  const validity = await client.query(Paginate(Match(Index('validity_by_name')))).catch(() => addUser(clientid))
  console.log("The status of Client:", clientid, " is ", validity)
  return validity
}

const withAuth = handlerFn => (req, res) => {
  try { 
    let valid = authenticate(req.body.clientid) 
    return valid;
  } catch(error) { return res.status(401) }
}

export default withAuth