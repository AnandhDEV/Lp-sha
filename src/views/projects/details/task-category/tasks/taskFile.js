import React, { useState, useEffect } from 'react';
import { Grid, FormControl, Button, IconButton, Typography, Box } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Icon } from '@iconify/react';

const TaskFile = ({ initialFile, onFileAdded, onFileDeleted }) => {
    const [selectedFile, setSelectedFile] = useState(initialFile || null);
    const [fileUrl, setFileUrl] = useState(null);

    console.log(initialFile);

    useEffect(() => {
        if (selectedFile) {
            if (typeof selectedFile === 'string') {
                setFileUrl(selectedFile); 
            } else {
                const objectUrl = URL.createObjectURL(selectedFile);
                setFileUrl(objectUrl);
            }
        }

        return () => {
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl); 
            }
        };
    }, [selectedFile]);

    const { getRootProps, getInputProps, open } = useDropzone({
        multiple: false,
        noClick: true,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const newFile = acceptedFiles[0];
                setSelectedFile(newFile);
                const newFileUrl = URL.createObjectURL(newFile);
                setFileUrl(newFileUrl);

                if (onFileAdded) {
                    onFileAdded(newFile);
                }
            }
        },
    });

    const handleDeleteFile = () => {
        setSelectedFile(null);
        setFileUrl(null);
        if (onFileDeleted) {
            onFileDeleted();
        }
    };

    return (
        <Grid container columnGap={2} className="flex-right">
            {!selectedFile ? (
                <Grid item xs={12}>
                    <FormControl>
                        <Button color="primary" size="large" onClick={open}>
                            + Add File
                        </Button>
                    </FormControl>
                    <input {...getInputProps()} style={{ display: 'none' }} />
                </Grid>
            ) : (
                <Grid item xs={12}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            padding: 1,
                        }}
                    >
                        <Typography>{selectedFile.name || "Existing File"}</Typography>

                        {/* Download button if there's a file URL */}
                        {fileUrl && (
                            <IconButton href={fileUrl} download={selectedFile.name} color="primary">
                                <Icon icon="mdi:download" fontSize={18} />
                            </IconButton>
                        )}

                        {/* Delete button */}
                        <IconButton color="error" onClick={handleDeleteFile}>
                            <Icon icon="mdi:trash-outline" fontSize={18} />
                        </IconButton>
                    </Box>
                </Grid>
            )}
        </Grid>
    );
};

export default TaskFile;
