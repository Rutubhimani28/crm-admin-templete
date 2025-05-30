// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import contact from './contact'
import users from '@src/views/apps/user/store'
// import contacts from '@src/views/apps/contact/store'

const rootReducer = {
  auth,
  contact,
  users,
  navbar,
  layout,
  // contacts
}

export default rootReducer
