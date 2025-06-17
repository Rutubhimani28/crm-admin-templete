// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import contact from './contact'
import lead from './lead'
import customer from './customer'
import task from './task'
import team from './team'
import profile from './Profile'
import Proposals from './Proposals'
import users from '@src/views/apps/user/store'
// import contacts from '@src/views/apps/contact/store'

const rootReducer = {
  auth,
  contact,
  users,
  navbar,
  layout,
  lead,
  customer,
  task,
  team,
  profile,
  Proposals
  // contacts
}

export default rootReducer
