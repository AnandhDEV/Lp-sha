// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { Icon } from '@iconify/react'
import { getBase64String } from 'src/helpers/helpers'
import toast from 'react-hot-toast'

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(15.75)
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 160
  }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

const ProfileUpload = props => {
  // ** State
  const [files, setFiles] = useState([])

  const profileBasestring = props.profile ? props.profile[0]?.base64String : null;
  const fileName=props.profile? props.profile[0]?.file.name:null;

  useEffect(()=>{
    if(props.profile != null){
      setFiles(profileBasestring)
    }
  },[])
 
  // ** Hook
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    onDrop: async acceptedFiles => {
      if (acceptedFiles.length <= 0) {
        toast.error('Please select an Image ')

      }
      else {
        const base64Strings = await Promise.all(
          acceptedFiles.map(async file => {
            const base64String = await getBase64String(file)

            return { file, base64String }
          })
        )
        setFiles(base64Strings)
        props?.handleProfile ? props.handleProfile(base64Strings) : null
      }
    }
  })
  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file)} />
    } else {
      return <Icon icon='mdi:file-document-outline' />
    }
  }

  return (
    <Box {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <Box
        sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}
      >
        <Box
          xs={12}
          sm={6}
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            gap: 3,
            alignItems: 'center',
            border: '1px solid #d9d9d9',
            borderRadius: 0.8,
            padding: 3,
            textAlign: ['center', 'center', 'inherit']
          }}
        >
          {(profileBasestring) ? (
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center' }}>
              <img
                key={''}
                alt={''}
                className='single-file-image'
                style={{ height: 50 }}
                src={profileBasestring}
              />
              <Typography>{fileName}</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center' }}>
              <Icon icon='mdi:image' fontSize={50} />
              <Typography
                color='textSecondary'
                sx={{ '& a': { color: 'primary.main', textDecoration: 'none' } }}
              >
                Drop Profile Picture or{' '}
                <Link href='/' onClick={e => e.preventDefault()}>
                  browse
                </Link>{' '}
                through your machine (.png, .jpg, .jpeg, .webp, .svg)
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ProfileUpload
