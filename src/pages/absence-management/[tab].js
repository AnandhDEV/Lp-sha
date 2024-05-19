// ** Third Party Imports
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import LeaveManagement from 'src/pages/absence-management'

// ** Demo Components Imports

const LeaveManagementTab = ({ tab, data }) => {
  const router = useRouter()

  useEffect(() => {
    if (tab != '[tab]') {
      localStorage.setItem('tab', tab)
    } else {
      tab = localStorage.getItem('tab')
    }
    router.replace({ pathname: `/absence-management/${tab}` })
  }, [tab])

  return tab && <LeaveManagement tab={tab} data={data} />
}

// export const getStaticPaths = () => {
//   return {
//     paths: [
//       { params: { tab: 'leaves' } },
//       { params: { tab: 'approval' } },
//       { params: { tab: 'reports' } },
//       { params: { tab: 'leave_policy' } },
//       { params: { tab: 'holidays' } }
//     ],
//     fallback: false
//   }
// }

// export const getStaticProps = async ({ params }) => {
//   return {
//     props: {
//       tab: params?.tab
//     }
//   }
// }

export const getServerSideProps = async ({ params }) => {
  const tab = params.tab

  return {
    props: {
      tab
    }
  }
}

export default LeaveManagementTab
