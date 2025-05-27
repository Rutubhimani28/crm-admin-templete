// ** React Imports
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

// ** Config
import themeConfig from '@configs/themeConfig'

// ** Utils
import { getHomeRouteForLoggedInUser, getUserData } from '@utils'

const VerticalMenuHeader = props => {
  // ** Props
  const { menuCollapsed, setGroupOpen, menuHover } = props

  // ** Vars
  const user = getUserData()

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([])
  }, [menuHover, menuCollapsed])

  // ** Menu toggler component

  return (
    <div className='navbar-header'>
      <ul className='nav navbar-nav flex-row'>
        <li className='nav-item me-auto'>
          <NavLink to={user ? getHomeRouteForLoggedInUser(user.role) : '/'} className='navbar-brand'>
            <span className='brand-logo'>
              <img src={themeConfig.app.appLogoImage} alt='logo' />
            </span>
            <h2 className='brand-text mb-0'>{themeConfig.app.appName}</h2>
          </NavLink>
        </li>
        {/* <li className='nav-item nav-toggle'>
          <div className='nav-link modern-nav-toggle cursor-pointer'>
            <Toggler />
            <X onClick={() => setMenuVisibility(false)} className='toggle-icon icon-x d-block d-xl-none' size={20} />
          </div>
        </li> */}
      </ul>
    </div>
  )
}

export default VerticalMenuHeader
