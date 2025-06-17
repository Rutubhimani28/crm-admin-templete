import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'

import { useDispatch, useSelector } from 'react-redux'
import { getTaskStats } from '../../../../redux/task'

const SupportTracker = props => {
  const dispatch = useDispatch()
  const [selectedView, setSelectedView] = useState('Daily')

  const taskStats = useSelector(state => state.task?.stats?.data || {})

  const {
    active = 0,
    pending = 0,
    completed: completed = 0,
    total = 0,
    inactive = 0,

  } = taskStats

  useEffect(() => {
    dispatch(getTaskStats(selectedView.toLowerCase())) // 'daily', 'weekly', 'monthly'
  }, [dispatch, selectedView])

  const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

  const radialOptions = {
    plotOptions: {
      radialBar: {
        size: 150,
        offsetY: 20,
        startAngle: -150,
        endAngle: 150,
        hollow: { size: '65%' },
        track: { background: '#fff', strokeWidth: '100%' },
        dataLabels: {
          name: { offsetY: -5, fontFamily: 'Montserrat', fontSize: '1rem' },
          value: { offsetY: 15, fontFamily: 'Montserrat', fontSize: '1.714rem' }
        }
      }
    },
    colors: [props.danger],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        gradientToColors: [props.primary],
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: { dashArray: 8 },
    labels: ['Completed Tasks']
  }

  const radialSeries = [completedPercentage]

  return (
    <Card>
      <CardHeader className='pb-0 d-flex justify-content-between align-items-center'>
        <CardTitle tag='h4'>Task Summary</CardTitle>
        <UncontrolledDropdown>
          <DropdownToggle color='flat-primary' caret>
            {selectedView}
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem onClick={() => setSelectedView('Daily')}>Daily</DropdownItem>
            {/* <DropdownItem onClick={() => setSelectedView('Weekly')}>Weekly</DropdownItem> */}
            <DropdownItem onClick={() => setSelectedView('Monthly')}>Monthly</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </CardHeader>

      <CardBody>
        <Row>
          <Col sm='2' className='d-flex flex-column flex-wrap text-center'>
            <h1 className='font-large-2 fw-bolder mt-2 mb-0'>{total}</h1>
            <CardText>Tasks</CardText>
          </Col>
          <Col sm='10' className='d-flex justify-content-center'>
            <Chart
              options={radialOptions}
              series={radialSeries}
              type='radialBar'
              height={270}
            />
          </Col>
        </Row>

        <div className='d-flex justify-content-between mt-1'>
          <div className='text-center'>
            <CardText className='mb-50'>Active</CardText>
            <span className='font-large-1 fw-bold'>{active}</span>
          </div>
          <div className='text-center'>
            <CardText className='mb-50'>Pending</CardText>
            <span className='font-large-1 fw-bold'>{pending}</span>
          </div>
          <div className='text-center'>
            <CardText className='mb-50'>Completed</CardText>
            <span className='font-large-1 fw-bold'>{completed}</span>
          </div>
          <div className='text-center'>
            <CardText className='mb-50'>Inactive</CardText>
            <span className='font-large-1 fw-bold'>{inactive}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default SupportTracker
