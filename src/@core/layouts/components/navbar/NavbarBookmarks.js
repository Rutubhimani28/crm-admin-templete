// ** React Imports
import { Fragment, useEffect } from "react";

// ** Third Party Components
import * as Icon from "react-feather";

// ** Reactstrap Imports
import { NavItem, NavLink } from "reactstrap";

// ** Store & Actions
import { getBookmarks } from "@store/navbar";
import { useDispatch } from "react-redux";

const NavbarBookmarks = (props) => {
  // ** Props
  const { setMenuVisibility } = props;

  // ** Store Vars
  const dispatch = useDispatch();

  // ** ComponentDidMount
  useEffect(() => {
    dispatch(getBookmarks());
  }, []);

  return (
    <Fragment>
      <ul className="navbar-nav d-xl-none">
        <NavItem className="mobile-menu me-auto">
          <NavLink
            className="nav-menu-main menu-toggle hidden-xs is-active"
            onClick={() => setMenuVisibility(true)}
          >
            <Icon.Menu className="ficon" />
          </NavLink>
        </NavItem>
      </ul>
      <ul className="nav navbar-nav bookmark-icons align-items-center">
        {/* {renderBookmarks()} */}
        {/* {renderExtraBookmarksDropdown()} */}
        {/* <NavItem className='nav-item d-none d-lg-block'>
          <NavLink className='bookmark-star' onClick={handleBookmarkVisibility}>
            <Icon.Star className='ficon text-warning' />
          </NavLink>
          <div className={classnames('bookmark-input search-input', { show: openSearch })}>
            <div className='bookmark-input-icon'>
              <Icon.Search size={14} />
            </div>
            {openSearch && store.suggestions.length ? (
              <Autocomplete
                wrapperClass={classnames('search-list search-list-bookmark', {
                  show: openSearch
                })}
                className='form-control'
                suggestions={!value.length ? store.bookmarks : store.suggestions}
                filterKey='title'
                autoFocus={true}
                defaultSuggestions
                suggestionLimit={!value.length ? store.bookmarks.length : 6}
                placeholder='Search...'
                externalClick={handleExternalClick}
                clearInput={(userInput, setUserInput) => handleClearInput(setUserInput)}
                onKeyDown={onKeyDown}
                value={value}
                onChange={handleInputChange}
                customRender={(
                  item,
                  i,
                  filteredData,
                  activeSuggestion,
                  onSuggestionItemClick,
                  onSuggestionItemHover
                ) => {
                  const IconTag = Icon[item.icon ? item.icon : 'X']
                  return (
                    <li
                      key={i}
                      onMouseEnter={() => onSuggestionItemHover(filteredData.indexOf(item))}
                      className={classnames('suggestion-item d-flex align-items-center justify-content-between', {
                        active: filteredData.indexOf(item) === activeSuggestion
                      })}
                    >
                      <Link
                        to={item.link}
                        className='d-flex align-items-center justify-content-between p-0'
                        onClick={() => {
                          setOpenSearch(false)
                          handleClearQueryInStore()
                        }}
                        style={{
                          width: 'calc(90%)'
                        }}
                      >
                        <div className='d-flex justify-content-start align-items-center overflow-hidden'>
                          <IconTag size={17.5} className='me-75' />
                          <span className='text-truncate'>{item.title}</span>
                        </div>
                      </Link>
                      <Icon.Star
                        size={17.5}
                        className={classnames('bookmark-icon float-end', {
                          'text-warning': item.isBookmarked
                        })}
                        onClick={() => handleBookmarkUpdate(item.id)}
                      />
                    </li>
                  )
                }}
              />
            ) : null}
          </div>
        </NavItem> */}
      </ul>
    </Fragment>
  );
};

export default NavbarBookmarks;
