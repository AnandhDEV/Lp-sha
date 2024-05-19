import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { formatLocalDate } from './dateFormats'

export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

export const SKILLS = [
  { name: 'Angular' },
  { name: 'Asp.Net' },
  { name: 'Azure' },
  { name: 'Javascript' },
  { name: 'Flutter' },
  { name: 'Figma' },
  { name: 'Python' },
  { name: 'SQL' },
  { name: 'Sharepoint' },
  { name: 'React' }
]

export const STATUS = [
  { id: 1, name: 'Not Started', color: 'info' },
  { id: 2, name: 'Inprogress', color: 'warning' },
  { id: 3, name: 'Completed', color: 'success' },
  { id: 4, name: 'Due', color: 'error' }
]

export const statusObj = {
  1: { color: 'info' },
  2: { color: 'warning' },
  3: { color: 'success' },
  4: { color: 'error' }
}
export const typeObj = {
  1: { color: 'primary' },
  2: { color: 'error' }
}


export const LEAVE_STATUS = [
  { id: 1, name: 'Pending', color: 'warning' },
  { id: 2, name: 'Approved', color: 'success' },
  { id: 3, name: 'Rejected', color: 'error' },
  { id: 4, name: 'Level 1 Pending', color: 'warning' },
  { id: 5, name: 'Level 1 Approved', color: 'info' },
  { id: 6, name: 'Level 1 Rejected', color: 'error' },
  { id: 7, name: 'Level 2 Pending', color: 'warning' },
  { id: 8, name: 'Level 2 Approved', color: 'success' },
  { id: 9, name: 'Level 2 Rejected', color: 'error' }
]

export const APPROVERS = [
  { id: 1, name: 'Reporting Manager' },
  { id: 2, name: 'Human Resource' },
  { id: 3, name: 'Not Applicable' }
]

export const CHART_COLORS = theme => {
  return [
    theme.palette.primary.main,
    hexToRGBA(theme.palette.primary.main, 0.8),
    hexToRGBA(theme.palette.primary.main, 0.6),
    hexToRGBA(theme.palette.primary.main, 0.4),
    hexToRGBA(theme.palette.primary.main, 0.2),
    hexToRGBA(theme.palette.primary.main, 0.1)
  ]
}

export const PROJECT_OPTIONS = ['Archive']

export const ORG_UNITS = [{ name: 'Marketing' }, ...SKILLS]

export const CATEGORIES = ['Leave Management', 'Tasks', 'Milestone']

export const NODATA = {
  oops: "Oops! It seems there's no data to display here right now.",
  missing: "Looks like we're missing some information here",
  access:
    'The requested information is not readily accessible at this time. We apologize for the inconvenience.',
  privacy:
    'Due to privacy restrictions, we are unable to disclose the information you are seeking.',
  maintenance: 'This page is currently under construction. Data will be available soon.',
  noLeave: 'Leaves were not discovered.',
  error: 'Something Went Wrong',
  noData: name => {
    return `Unable to discover any ${name}`
  }
}

export const errorMessage = {
  401: `You don't have permission to view this resource. Please contact`,
  403: `Access to this resource is forbidden. Please contact`,
  500: `There was an unexpected server error. Please try again later or contact`,
  default: `Things didn’t go as planned`
}

export const roles = {
  1: { name: 'Admin', icon: 'mdi:laptop', color: 'error.main' },
  // 2: { name: 'Management', icon: 'mdi:cog-outline', color: 'warning.main' },
  3: { name: 'Operations', icon: 'mdi:pencil-outline', color: 'info.main' },
  4: { name: 'User', icon: 'mdi:account-outline', color: 'primary.main' }
}

export const TASK_PRIORITIES = [
  { id: 1, name: 'Low', color: 'success' },
  { id: 2, name: 'Medium', color: 'warning' },
  { id: 3, name: 'High', color: 'error' }
]

export const TASk_LIST = [
  {
    id: 1,
    task: 'Create Leave Managament',
    status: 'Completed',
    owner: 'Dhineshkumar Selvam',
    estimatedHours: 10,
    dueDate: formatLocalDate(new Date()),
    isBillable: false
  },
  {
    id: 2,
    task: 'Create Tasks Page',
    status: 'Not Started',
    estimatedHours: 15,
    owner: 'Naveenkumar Mounasamy',
    dueDate: formatLocalDate(new Date()),
    isBillable: false
  },
  {
    id: 3,
    task: 'Enhance the Table View for Tasks',
    status: 'Working on it',
    owner: 'Pavithra Murugesan',
    estimatedHours: 20,
    dueDate: formatLocalDate(new Date()),
    isBillable: false
  },
  {
    id: 4,
    task: 'API Inetegrations',
    status: 'Working on it',
    owner: 'Babysha Papanasam',
    estimatedHours: 25,
    dueDate: formatLocalDate(new Date()),
    isBillable: false
  },
  {
    id: 5,
    task: 'Product Launch',
    status: 'Due',
    owner: 'Mukesh Sekar',
    estimatedHours: 30,
    dueDate: formatLocalDate(new Date()),
    isBillable: false
  }
]

export const PROJECT_MEMBERS = [
  {
    fullName: 'NaveenKumar Mounasamy',
    email: 'naveen.mounasamy@leanprofit.ai',
    role: 'Software Engineer',
    skills: ['Asp.Net Core', 'SQL', 'Angular'],
    feedbacks: 6,
    tasks: 428,
    utilization: '30%'
  },
  {
    fullName: 'Chanakya Jayabalan',
    email: 'chanakya.b@leanprofit.ai',
    role: 'Founder & CEO of Athen',
    skills: ['Sharepoint'],
    feedbacks: 310,
    tasks: 50,
    utilization: '70%'
  },
  {
    fullName: 'BabySha Papanasam',
    email: 'babysha.papanasam@leanprofit.ai',
    role: 'Junior Software Engineer',
    skills: ['Asp.Net Core', 'SQL', 'React-Js'],
    feedbacks: 2,
    tasks: 35,
    utilization: '50%'
  },
  {
    fullName: 'Dhivya Kumarasamy',
    email: 'dhivya.kumarasamy@leanprofit.ai',
    role: 'Team Lead',
    skills: ['Asp.Net Core', 'SQL', 'Azure', 'Power Automate'],
    feedbacks: 23,
    tasks: 579,
    utilization: '90%'
  },
  {
    fullName: 'Pavithra Murugesan',
    email: 'pavithra.murugesan@leanprofit.ai',
    role: 'Senior Software Engineer',
    skills: ['Sharepoint', 'React', 'SQL', 'Power Automate'],
    feedbacks: 18,
    tasks: 218,
    utilization: '60%'
  }
]

export const FEEDBACKS = [
  {
    title: 'An employee who doesn’t hold to their commitments on group or team projects.',
    description:
      'I noticed I asked you for a deliverable on this key project by the end of last week. I still haven’t received this deliverable and wanted to follow up. If a deadline doesn’t work well with your bandwidth, would you be able to check in with me? I’d love to get a good idea of what you can commit to without overloading your workload.',
    member: 'Naveenkumar Mounasamy',
    rating: 4
  },
  {
    title: 'A direct report who struggles to meet deadlines.',
    description:
      'hanks for letting me know you’re running behind schedule and need an extension. I’ve noticed this is the third time you’ve asked for an extension in the past two weeks. In our next one-on-one, can you come up with a list of projects and the amount of time that you’re spending on each project? I wonder if we can see how you’re managing your time and identify efficiencies.',
    member: 'Pavithra Murugesan',
    rating: 3
  },
  {
    title: 'Improve customer service skills.',
    description:
      'Always try to exhibit creativity and flexibility in solving customers’ problems and questions.Try to address problems as quickly as possible even if it’s a demanding customer.',
    member: 'Babysha Papanasam',
    rating: 2
  },
  {
    title: 'Give time and space for clarifying questions.',
    description:
      'Constructive feedback can be hard to hear. It can also take some time to process. Make sure you give the person the time and space for questions and follow-up. ',
    member: 'Dhivya Kumarasamy',
    rating: 1
  }
]

export const ORGANIZATIOn_SIZE = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1001-5000 employees'
]
