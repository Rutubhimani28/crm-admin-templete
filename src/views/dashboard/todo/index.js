// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

// ** Third Party Components
import classnames from 'classnames'
import { useSkin } from '@hooks/useSkin'

// ** Todo App Components
import Tasks from './Tasks'
import Sidebar from './Sidebar'
import TaskSidebar from './TaskSidebar'
// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { addTask, deleteTask, getTasks,selectTask, updateTask, reOrderTasks } from "../../../redux/task";
// import { getTasks, updateTask, selectTask, addTask, deleteTask, reOrderTasks } from './store'

// ** Styles
import '@styles/react/apps/app-todo.scss'
import { Box } from '@mui/material'

const Todo = () => {
  // ** States
  const { skin } = useSkin()
  const [sort, setSort] = useState('')
  const [query, setQuery] = useState('')
  const [mainSidebar, setMainSidebar] = useState(false)
  const [openTaskSidebar, setOpenTaskSidebar] = useState(false)
 const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.task)
console.log(store,"store")
  // ** URL Params
  const paramsURL = useParams()
  const params = {
    filter: paramsURL.filter || '',
    q: query || '',
    sortBy: sort || '',
    tag: paramsURL.tag || ''
  }

  // ** Function to handle Left sidebar & Task sidebar
  const handleMainSidebar = () => setMainSidebar(!mainSidebar)
  const handleTaskSidebar = () => setOpenTaskSidebar(!openTaskSidebar)

  // ** Get Tasks on mount & based on dependency change
  // useEffect(() => {
  //   dispatch(
  //     getTasks({
  //       filter: paramsURL.filter || '',
  //       q: query || '',
  //       sortBy: sort || '',
  //       tag: paramsURL.tag || ''
  //     })
  //   )
  // }, [store.tasks.length, paramsURL.filter, paramsURL.tag, query, sort])
  useEffect(() => {
     dispatch(
          getTasks({
            page: paginationModel.page + 1,
            pageSize: paginationModel.pageSize,
          })
        );
  }, [])

  return (
      <Box className={skin === "light" ? "box-wrapper": "dark-box-wrapper"}>
      <Sidebar
        store={store}
        params={params}
        getTasks={getTasks}
        dispatch={dispatch}
        mainSidebar={mainSidebar}
        urlFilter={paramsURL.filter}
        setMainSidebar={setMainSidebar}
        handleTaskSidebar={handleTaskSidebar}
      />
      <div className='content-right '>
        <div className='content-wrapper'>
          <div className='content-body'>
            <div
              className={classnames('body-content-overlay', {
                show: mainSidebar === true
              })}
              onClick={handleMainSidebar}
            ></div>

            {store ? (
              <Tasks
                store={store}
                tasks={store?.data}
                sort={sort}
                query={query}
                params={params}
                setSort={setSort}
                setQuery={setQuery}
                dispatch={dispatch}
                getTasks={getTasks}
                paramsURL={paramsURL}
                updateTask={updateTask}
                selectTask={selectTask}
                reOrderTasks={reOrderTasks}
                handleMainSidebar={handleMainSidebar}
                handleTaskSidebar={handleTaskSidebar}
              />
            ) : null}

            <TaskSidebar
              store={store}
              params={params}
              addTask={addTask}
              dispatch={dispatch}
              open={openTaskSidebar}
              updateTask={updateTask}
              selectTask={selectTask}
              deleteTask={deleteTask}
              handleTaskSidebar={handleTaskSidebar}
            />
          </div>
        </div>
      </div>
      </Box>
  )
}

export default Todo
