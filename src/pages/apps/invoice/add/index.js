/* eslint-disable react-hooks/exhaustive-deps */

import { useRouter } from 'next/router'

// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components
import axios from 'axios'

// ** Demo Components Imports
import AddCard from 'src/views/apps/invoice/add/AddCard'
import AddActions from 'src/views/apps/invoice/add/AddActions'
import AddNewCustomers from 'src/views/apps/invoice/add/AddNewCustomer'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { getProjectforInvoice, reset } from 'src/store/apps/invoice'
import { useDispatch, useSelector } from 'react-redux'
import { fetchClients } from 'src/store/clients'
import { endpointURL, endpoints } from 'src/store/endpoints/endpoints'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import FallbackSpinner from 'src/@core/components/spinner'
import instance from 'src/store/endpoints/interceptor'
import { NODATA } from 'src/helpers/constants'

const InvoiceAdd = ({ apiClientData, invoiceNumber }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  // ** State
  const { data } = useSelector(state => state.clients)
  const [addCustomerOpen, setAddCustomerOpen] = useState(false)
  const [dueDate, setDueDate] = useState('')
  const [billDate, setbillDate] = useState('')
  const [error, setError] = useState(false)

  const { selectedProject, selectedClient, invoiceDetails, loader } = useSelector(
    state => state.invoice
  )

  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  useEffect(() => {
    dispatch(getProjectforInvoice())
    dispatch(fetchClients())
  }, [])

  const saveInvoice = async () => {
    let payload = {
      // name: "",
      // projectID: selectedProject,
      // clientID: selectedClient,
      // dueDate: dayjs(dueDate).format(),
      // generatedDate: dayjs().format(),
      // period: dayjs(dueDate).format('MM'),
      invoiceNumber: invoiceDetails.invoiceNumber,
      name: 'dfdf',
      orgID: invoiceDetails.clientDetail.organizationId,
      clientID: invoiceDetails.clientDetail.id,
      projectID: selectedProject,
      dueDate: dayjs(billDate).format(),
      generatedDate: dayjs().format(),
      period: dayjs(dueDate).format('MM'),
      userList: invoiceDetails.userList,
      totalProjCost: invoiceDetails.totalProjCost,
      totalProjCostwithTax: invoiceDetails.totalProjCostwithTax,
      tax: 23
    }

    try {
      const response = await instance.post(endpointURL(endpoints.saveInvoice), payload)
      dispatch(reset())
      setDueDate('')
      setbillDate('')
      toast.success('Successfully added Invoice')
    } catch (error) {
      toast.error(NODATA.error)
    }
  }

  const handleSave = () => {
    if (dueDate && selectedProject && billDate) {
      saveInvoice()
    } else {
      setError(true)
    }
  }

  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Grid container spacing={6}>
        <Grid item xl={9} md={8} xs={12}>
          <AddCard
            billDate={billDate}
            setbillDate={setbillDate}
            error={error}
            dueDate={dueDate}
            setDueDate={setDueDate}
            clients={data}
            invoiceNumber={invoiceNumber}
            selectedClient={selectedClient}
            toggleAddCustomerDrawer={toggleAddCustomerDrawer}
          />
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <AddActions error={error} setError={setError} handleSave={handleSave} />
        </Grid>
      </Grid>
      {/* <AddNewCustomers
        clients={data}
        open={addCustomerOpen}
        toggle={toggleAddCustomerDrawer}
        setSelectedClient={setSelectedClient}
      /> */}
    </DatePickerWrapper>
  )
}

export const getStaticProps = async () => {
  const clientResponse = await axios.get('/apps/invoice/clients')
  const apiClientData = clientResponse.data
  const allInvoicesResponse = await axios.get('/apps/invoice/invoices', {
    params: { q: '', status: '' }
  })
  const lastInvoiceNumber = Math.max(...allInvoicesResponse.data.allData.map(i => i.id))

  return {
    props: {
      apiClientData,
      invoiceNumber: lastInvoiceNumber + 1
    }
  }
}

export default InvoiceAdd
