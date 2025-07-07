import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
    TextField,
    Button,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Card,
    Grid
} from '@mui/material'
import { Input, Label } from 'reactstrap'
import { Upload } from 'react-feather'
import { getAllDocuments, uploadDocument } from '../../../redux/document'
import { useDispatch, useSelector } from 'react-redux'
import { useSweetToast } from "../../../@core/layouts/utils";

const MAX_FILE_SIZE_MB = 15
const Document = () => {
    const [files, setFiles] = useState([])
    const dispatch = useDispatch()
    const document = useSelector((state) => state?.Document?.data)
    const [selectedDocUrl, setSelectedDocUrl] = useState(null)
    const [loading, setLoading] = useState(false);
    const SweetToast = useSweetToast();


    const initialValues = {
        documentName: '',
    }

    const validationSchema = Yup.object({
        documentName: Yup.string().required('Document Name is required'),
    })

    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            // if (files.length === 0) {
            //     alert('Please upload at least one file.')
            //     return
            // }
            const formData = new FormData()
            formData.append('documentName', values.documentName)
            formData.append('file', files[0]) // Only uploading one file
            setLoading(true)
            try {
                const res = await dispatch(uploadDocument(formData))
                if (res.payload?.status === 201) {
                    SweetToast.fire({
                        icon: "success",
                        title: res.payload.data.message,
                    });
                } else {
                    SweetToast.fire({
                        icon: "error",
                        title: res.payload.data.message,
                    });
                }
                resetForm()
                setFiles([])
                dispatch(getAllDocuments())
            } catch (error) {
                console.error('Upload error:', error)
            } finally {
                setLoading(false)
            }
        }
    })

    const handleFileUpload = (e) => {
        const uploadedFiles = Array.from(e.target.files)
        const validFiles = uploadedFiles.filter(file => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024)

        if (validFiles.length < uploadedFiles.length) {
            alert(`Some files were larger than ${MAX_FILE_SIZE_MB}MB and were not added.`)
        }

        setFiles([...files, ...validFiles])
    }

    const { handleSubmit, values, handleChange, handleBlur, touched, errors } = formik

    useEffect(() => {
        dispatch(getAllDocuments())
    }, [])

    return (
        <Box display="flex" p={2} gap={3}>
            {/* Upload Form */}
            <Card sx={{ width: '40%', p: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Label for="documentName">Document Name <span className="text-danger">*</span></Label>
                        <Input
                            id="documentName"
                            name="documentName"
                            value={values.documentName}
                            onChange={handleChange}
                            placeholder="Document Name"
                            onBlur={handleBlur}
                            invalid={touched.documentName && !!errors.documentName}
                        />
                        {touched.documentName && errors.documentName && (
                            <div className="text-danger">{errors.documentName}</div>
                        )}

                        <Grid size={{ xs: 12 }}>
                            <Box
                                component="label"
                                htmlFor="file-upload"
                                sx={{
                                    width: '100%',
                                    border: '2px dashed #ccc',
                                    borderRadius: '12px',
                                    p: 3,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    '&:hover': { borderColor: '#4a3aff' }
                                }}
                            >
                                <Upload sx={{ fontSize: 40, color: '#4a3aff' }} />
                                <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600, color: '#4a3aff' }}>
                                    Upload Files
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Accepted File Types (PDFs)
                                </Typography>
                                <input
                                    id="file-upload"
                                    type="file"
                                    hidden
                                    multiple
                                    onChange={handleFileUpload}
                                    accept=".pdf"
                                />
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ backgroundColor: '#4a3aff', textTransform: 'none' }}
                                disabled={loading}

                            >
                                {loading ? 'Uploading...' : 'Publish now'}

                            </Button>
                        </Grid>
                    </Grid>
                </form>

                <Divider sx={{ my: 4 }} />
                <Typography variant="h6">Uploaded Files</Typography>
                <List dense>
                    {files.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="No files uploaded yet." />
                        </ListItem>
                    ) : (
                        files.map((file, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={file.name}
                                    secondary={`${(file.size / 1024).toFixed(2)} KB`}
                                />
                            </ListItem>
                        ))
                    )}
                </List>
            </Card>

            {/* File Explorer & Viewer */}
            <Card sx={{ width: '60%', p: 2, height: '80vh', overflowY: 'auto' }}>
                <Typography variant="h6" gutterBottom>File Explorer</Typography>
                <List dense>
                    {document?.length === 0 ? (
                        <ListItem><ListItemText primary="No documents found." /></ListItem>
                    ) : (
                        document.map((doc, idx) => {
                            const fileUrl = doc.url?.url
                            return (
                                <ListItem
                                    key={doc.id || idx}
                                    button={true}
                                    // onClick={() => setSelectedDocUrl(fileUrl)}
                                    sx={{ '&:hover': { backgroundColor: '#161d31', color: '#fff', borderRadius: '10px', } }}
                                >
                                    <ListItemText
                                        primary={`📕 ${doc.title || doc.documentName || doc.fileName}`}
                                        secondary={`Uploaded by ${doc.uploadedBy?.userName || 'Unknown'} on ${new Date(doc.uploadedAt).toLocaleDateString()}`}
                                    />
                                </ListItem>
                            )
                        })
                    )}
                </List>
                {/* {selectedDocUrl && (
                    <Box mt={4}>
                        <Typography variant="h6" gutterBottom>Document Preview</Typography>
                        <Box sx={{ height: '70vh' }}>
                            {selectedDocUrl.endsWith('.pdf') ? (
                                <iframe
                                    src={selectedDocUrl}
                                    title="PDF Preview"
                                    width="100%"
                                    height="100%"
                                    style={{ border: '1px solid #ccc', borderRadius: '8px' }}
                                />
                            ) : selectedDocUrl.match(/\.(jpg|jpeg|png)$/i) ? (
                                <img
                                    src={selectedDocUrl}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px' }}
                                />
                            ) : (
                                <Typography color="textSecondary">
                                    Preview not supported for this file type.
                                </Typography>
                            )}
                        </Box>
                    </Box>
                )} */}
            </Card>
        </Box>
    )
}

export default Document
