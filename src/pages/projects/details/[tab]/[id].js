// ** Third Party Imports
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import ProjectDetails from 'src/views/projects/ProjectDetails'

// ** Demo Components Imports

const ProjectDetailsTab = ({ tab, id }) => {
  const store = useSelector(state => state.projects)
  const [projectId, setProjectId] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (tab != '[tab]') {
      localStorage.setItem('tab', tab)
    } else {
      tab = localStorage.getItem('tab')
    }
    router.replace({ pathname: `/projects/details/${tab}/${id}` })
  }, [tab, id])

  // useEffect(() => {
  //   setProjectId(id)
  // }, [])

  return <ProjectDetails tab={tab} id={id} data={[]} />
}

export const getServerSideProps = async ({ params }) => {
  const tab = params.tab

  return {
    props: {
      tab,
      id: params.id
    }
  }
}

export default ProjectDetailsTab
