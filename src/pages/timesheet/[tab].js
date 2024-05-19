import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AppTimeSheets from '.'

const TimeSheetTab = ({ tab }) => {
  const router = useRouter()

  useEffect(() => {
    if (tab != '[tab]') {
      localStorage.setItem('tab', tab)
    } else {
      tab = localStorage.getItem('tab')
    }
    router.replace({ pathname: `/timesheet/${tab}` })
  }, [tab])

  return <AppTimeSheets tab={tab} />
}

export const getServerSideProps = async ({ params }) => {
  const tab = params.tab

  return {
    props: {
      tab
    }
  }
}

export default TimeSheetTab
