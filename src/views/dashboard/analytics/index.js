// ** React Imports
import { useContext, useEffect, useState } from 'react'

// ** Icons Imports
import { BarChart2, CheckSquare, List, PhoneCall, User, UserCheck, UserPlus, UserX } from 'react-feather'

import { ThemeColors } from '@src/utility/context/ThemeColors'

import { Row, Col, Card, CardHeader, CardTitle, CardBody, Button } from 'reactstrap'

import SupportTracker from '@src/views/ui-elements/cards/analytics/SupportTracker'


import '@styles/react/libs/charts/apex-charts.scss'
import { getLeads } from '../../../redux/lead'
import { useDispatch, useSelector } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { Edit, Eye, Trash2 } from "react-feather";
import { useSkin } from '@hooks/useSkin'
import { useNavigate } from 'react-router-dom'
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal'
import { getContacts } from '../../../redux/contact'
import { getCustomers } from '../../../redux/customer'
import { getTasks } from '../../../redux/task'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const AnalyticsDashboard = () => {
  // ** Context
  const { colors } = useContext(ThemeColors)
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });
  const dispatch = useDispatch();
  const leadList = useSelector((state) => state?.lead);
  const { skin } = useSkin()
  const navigate = useNavigate()
  const contactList = useSelector((state) => state?.contact);
  const customerList = useSelector((state) => state?.customer);
  const taskList = useSelector((state) => state?.task);



  useEffect(() => {
    dispatch(getLeads({ page: paginationModel.page + 1, pageSize: paginationModel.pageSize }));
    dispatch(
      getContacts({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      })
    );
    dispatch(
      getCustomers({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      })
    );
    dispatch(
      getTasks({
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      })
    );
  }, [dispatch, paginationModel]);

  useEffect(() => {
    if (leadList?.data?.length) {
      const dataWithId = leadList?.data?.map((item) => ({
        ...item,
      }));
      setRows(dataWithId);
    }
  }, [leadList]);


  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phoneNumber", headerName: "Phone Number", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const status = params.value;
        let bgColor = '';
        let textColor = '';

        switch (status) {
          case 'Active':
            bgColor = 'rgba(0, 255, 135, 0.1)';
            textColor = '#00ff87';
            break;
          case 'Inactive':
            bgColor = 'rgba(255, 0, 0, 0.1)';
            textColor = '#ff4d4f';
            break;
          case 'Pending':
            bgColor = 'rgba(255, 193, 7, 0.1)';
            textColor = '#ffc107';
            break;
          default:
            bgColor = 'rgba(108, 117, 125, 0.1)';
            textColor = '#6c757d';
        }

        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <div
              style={{
                backgroundColor: bgColor,
                color: textColor,
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 500,
                lineHeight: 1,
                textTransform: 'capitalize',
                width: 'fit-content',
                textAlign: 'center',

              }}

            >
              {status}
            </div>
          </div>
        );
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 1,

      renderCell: (params) => {
        const data = params.row;
        return (
          <div style={{ display: "flex", marginTop: "7px" }}>
            <Button
              variant="outlined"
              size="small"
              style={{ padding: "2px" }}
              color=''
              onClick={() => {
                handleEdit(data)
              }}
            >
              <Edit size={20} color="green" />
            </Button>
            <Button
              variant="contained"
              color=''
              size="small"
              style={{ padding: "4px" }}
              onClick={() => navigate(`/lead/leadView/${data._id}`)}
            >
              <Eye size={20} color={skin === "light" ? "blue" : "white"} />
            </Button>

            <Button
              variant="contained"
              color="error"
              size="small"
              style={{ padding: "2px" }}
              onClick={() => dispatch(() => openDeleteModal(data))}
            >
              <Trash2 size={20} color="red" />
            </Button>
          </div>
        );
      },
    },
  ];

  const chartData = [
    { name: 'Contacts', value: contactList?.total || 0 },
    { name: 'Leads', value: leadList?.total || 0 },
    { name: 'Customers', value: customerList?.total || 0 },
    { name: 'Tasks', value: taskList?.total || 0 }
  ]

  return (
    <div id='dashboard-analytics'>
      <Row>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='primary'
            statTitle='Total Contact'
            icon={<PhoneCall size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{contactList.total}</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='danger'
            statTitle='Total Lead'
            icon={<BarChart2 size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{leadList.total}</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='success'
            statTitle='Total Customer'
            icon={<UserCheck size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{customerList.total}</h3>}
          />
        </Col>
        <Col lg='3' sm='6'>
          <StatsHorizontal
            color='warning'
            statTitle='Total Task'
            icon={<CheckSquare size={20} />}
            renderStats={<h3 className='fw-bolder mb-75'>{taskList.total}</h3>}
          />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col lg='6' xs='12'>
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Overview</CardTitle>
            </CardHeader>
            <CardBody style={{ height: 300 }}> {/* IMPORTANT: Set height */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7367F0" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </Col>
        <Col lg='6' xs='12'>
          <SupportTracker primary={colors.primary.main} danger={colors.danger.main} />
        </Col>
      </Row>
      <Row className='match-height'>
        <Box style={{ height: 635, width: "100%" }}>
          <h3>Lead List</h3>
          <DataGrid
            rows={rows.slice(0, 5)}
            columns={columns}
            hideFooter
            disableRowSelectionOnClick
            getRowId={(row) => row._id}
            autoHeight
          />
          {leadList?.total > 5 && (
            <div className='d-flex justify-content-end mt-1'>
              <Button color="primary" onClick={() => navigate('/dashboard/lead')}>
                View All Leads
              </Button>
            </div>
          )}
        </Box>
      </Row>
    </div>
  )
}

export default AnalyticsDashboard
