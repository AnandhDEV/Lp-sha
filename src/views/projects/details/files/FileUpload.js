// ** React Imports
import { Fragment, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { Divider, Grid } from '@mui/material'

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

const FileUpload = ({ onSelectFiles }) => {
  // ** State
  const [files, setFiles] = useState([])

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
      onSelectFiles(acceptedFiles.map(file => Object.assign(file)))
    }
  })

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file)} />
    } else {
      return <Icon icon='mdi:file-document-outline' />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
    onSelectFiles([...filtered])
  }

  const fileList = files.map(file => (
    <Grid key={file.name} className='d-flex'>
      <Grid>
        {/* {renderFilePreview(file)} */}
        <Box className='d-flex' sx={{ alignItems: 'center' }}>
          <Typography variant='body2'>{file.name}</Typography>
          <Box justifyContent='space-between'>
            {/* <Typography variant='caption'>
              {Math.round(file.size / 100) / 10 > 1000
                ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
            </Typography> */}
            <IconButton
              color='error'
              onClick={() => handleRemoveFile(file)}
              sx={{ height: 'max-content' }}
            >
              <Icon icon='mdi:trash-outline' fontSize={15} />
            </IconButton>
          </Box>
        </Box>
      </Grid>
    </Grid>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  return (
    <Fragment>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: ['column', 'column', 'row'],
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Img alt='Upload img' src='/images/misc/upload.png' height={100} sx={{ m: 'auto' }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: ['center', 'center', 'inherit']
            }}
          >
            <HeadingTypography variant='h6'>Drop files here or click to upload.</HeadingTypography>
            <Typography
              color='textSecondary'
              sx={{ '& a': { color: 'primary.main', textDecoration: 'none' } }}
            >
              Drop files here or click{' '}
              <Link href='/' onClick={e => e.preventDefault()}>
                browse
              </Link>{' '}
              thorough your machine
            </Typography>
          </Box>
        </Box>
      </div>
      <br />
      {files.length ? (
        <Box className='gap-1' sx={{ flexWrap: 'wrap' }}>
          <Divider flexItem />
          {fileList}
          {/* <div className='buttons'>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
          </div> */}
        </Box>
      ) : null}
    </Fragment>
  )
}

export default FileUpload
