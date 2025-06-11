import { useEffect, useRef, useState } from 'react'

// import { Camera, Save, Edit, Mail, Phone, Briefcase, User } from 'react-feather'
// import { Building } from 'react-feather'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-hot-toast'
import { Camera, Edit, Save } from 'react-feather'
import { Card, Form, Input, Label, Spinner } from 'reactstrap'
import { Avatar, Box, Button, CardContent, CardHeader, Divider, Grid, IconButton, Paper, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile, updateProfile } from '../../../redux/Profile'
import moment from 'moment'



const Profile = () => {
    const [isEditing, setIsEditing] = useState(false)
    const dispatch = useDispatch()
    const userData = useSelector((state) => state.profile?.data)
    const [avatar, setAvatar] = useState(userData?.image?.url)
    const [loading, setLoading] = useState(false)

    const handleAvatarChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setAvatar(URL.createObjectURL(file));
        }
    }

    const validationSchema = Yup.object().shape({
        userName: Yup.string().required('Full name is required'),
        email: Yup.string().email('Invalid email address'),
        role: Yup.string().required('Role is required')
    })


    const formik = useFormik({
        initialValues: {
            userName: userData?.userName || '',
            email: userData?.emailAddress || '',
            role: userData?.role || '',
            phoneNumber: userData?.phoneNumber || '',
            address: userData?.address || '',
            city: userData?.city || '',
            zip: userData?.zip || '',
            dateOfBirth: userData.dateOfBirth ? moment(userData.dateOfBirth).format('YYYY-MM-DD') : ''

        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            console.log("values", values)
            console.log(" moment(values.dateOfBirth).format('YYYY-MM-DD')", moment(values.dateOfBirth).format('YYYY-MM-DD'))
            setLoading(true)
            try {
                const formData = new FormData();
                formData.append("userName", values.userName);
                formData.append("email", values.email);
                formData.append("role", values.role);
                formData.append("phoneNumber", values.phoneNumber);
                formData.append("address", values.address);
                formData.append("city", values.city);
                formData.append("zip", values.zip);
                formData.append("dateOfBirth", moment(values?.dateOfBirth).format('YYYY-MM-DD'));

                const fileInput = document.getElementById("avatar-upload");
                if (fileInput && fileInput.files[0]) {
                    formData.append("image", fileInput.files[0]);
                }

                dispatch(updateProfile(formData))
                toast.success('Profile updated successfully')
                setIsEditing(false)
            } catch (error) {
                toast.error('Failed to update profile')
            } finally {
                setLoading(false)
            }
        }
    })

    const { handleSubmit, values, errors, touched, handleChange, handleBlur, setFieldValue } = formik

    useEffect(() => {
        dispatch(getProfile())
    }, [])

    if (!userData) {
        return <Typography>Loading profile...</Typography>
    }


    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Grid container spacing={6}>
                {/* Avatar Section */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 3,
                        borderRadius: 2,
                    }}>
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <Avatar
                                src={avatar || '/images/default-avatar.png'}
                                sx={{
                                    width: 150,
                                    height: 150,
                                    mb: 2,
                                    border: '4px solid',
                                    borderColor: 'primary.main'
                                }}
                            />
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="avatar-upload"
                                type="file"
                                onChange={handleAvatarChange}
                            />


                            <label htmlFor="avatar-upload">
                                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        disabled={!isEditing}
                                        onClick={() => {
                                            console.log()
                                            setAvatar(null);

                                        }}
                                    >
                                        Clear
                                    </Button>

                                    <label htmlFor="avatar-upload">
                                        <Button variant="contained" color="primary" component="span" disabled={!isEditing}>
                                            {loading ? (
                                                <Spinner className="spinner-border spinner-border-sm " />
                                            ) : (
                                                "Upload"
                                            )}
                                        </Button>
                                    </label>
                                </Box>
                            </label>
                        </Box>
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Form onSubmit={handleSubmit}>
                        <Card sx={{ boxShadow: 3 }}>
                            <CardHeader
                                title="Personal Information"
                                action={
                                    !isEditing && (
                                        <Button
                                            variant="contained"
                                            startIcon={<Edit size={20} />}
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit Profile
                                        </Button>
                                    )
                                }
                            />
                            <CardContent>
                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                    <Grid size={6}>
                                        <Label for="userName">Full Name</Label>
                                        {isEditing ? (
                                            <Input
                                                id="userName"
                                                name="userName"
                                                value={values.userName}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Full Name"
                                                invalid={touched.userName && !!errors.userName}
                                            />
                                        ) : (
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                {userData.userName || '-'}
                                            </Typography>
                                        )}
                                    </Grid>

                                    <Grid size={6}>
                                        <Label for="email">Email</Label>
                                        {isEditing ? (
                                            <Input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="example@domain.com"
                                                invalid={touched.email && !!errors.email}
                                                disabled
                                            />
                                        ) : (
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                {userData.emailAddress || '-'}
                                            </Typography>
                                        )}
                                    </Grid>

                                    <Grid size={6}>
                                        <Label for="role">Role</Label>
                                        {isEditing ? (
                                            <Input
                                                type="text"
                                                id="role"
                                                name="role"
                                                value={values.role}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Role"
                                                invalid={touched.role && !!errors.role}
                                            />
                                        ) : (
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                {userData.role || '-'}
                                            </Typography>
                                        )}
                                    </Grid>

                                    <Grid size={6}>
                                        <Label for="phoneNumber">Phone Number</Label>
                                        {isEditing ? (
                                            <Input
                                                type="text"
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                value={values.phoneNumber}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Phone Number"
                                                invalid={touched.phoneNumber && !!errors.phoneNumber}
                                            />
                                        ) : (
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                {userData.phoneNumber || '-'}
                                            </Typography>
                                        )}
                                    </Grid>


                                    <Grid size={6}>
                                        <Label for="address">Address</Label>
                                        {isEditing ? (
                                            <Input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={values.address}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Address"
                                                invalid={touched.address && !!errors.address}
                                            />
                                        ) : (
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                {userData.address || '-'}
                                            </Typography>
                                        )}
                                    </Grid>

                                    <Grid size={6}>
                                        <Label for="city">City</Label>
                                        {isEditing ? (
                                            <Input
                                                type="text"
                                                id="city"
                                                name="city"
                                                value={values.city}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="city"
                                                invalid={touched.city && !!errors.city}
                                            />
                                        ) : (
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                {userData.city || '-'}
                                            </Typography>
                                        )}
                                    </Grid>


                                    <Grid size={6}>
                                        <Label for="zip">zip</Label>
                                        {isEditing ? (
                                            <Input
                                                type="text"
                                                id="zip"
                                                name="zip"
                                                value={values.zip}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Zip"
                                                invalid={touched.zip && !!errors.zip}
                                            />
                                        ) : (
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                {userData.zip || '-'}
                                            </Typography>
                                        )}
                                    </Grid>

                                    <Grid size={6}>
                                        <Label for="dateOfBirth">Date Of Birth</Label>
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                id="dateOfBirth"
                                                name="dateOfBirth"
                                                value={values.dateOfBirth}
                                                onChange={(e) => {
                                                    // handleChange(e);
                                                    setFieldValue("dateOfBirth", e.target.value)
                                                }}
                                                onBlur={handleBlur}
                                                placeholder="Date Of Birth"
                                                invalid={touched.dateOfBirth && !!errors.dateOfBirth}
                                            />
                                        ) : (
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                {userData.dateOfBirth
                                                    ? moment(userData.dateOfBirth).format('YYYY-MM-DD')
                                                    : '-'}
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>
                                {isEditing && (
                                    <Grid size={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                            <Button
                                                variant="outlined"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                startIcon={<Save size={20} />}
                                            >
                                                {loading ? (
                                                    <Spinner className="spinner-border spinner-border-sm " />
                                                ) : (
                                                    "Save Changes"
                                                )}
                                                Save Changes
                                            </Button>
                                        </Box>
                                    </Grid>
                                )}

                            </CardContent>
                        </Card>
                    </Form>

                </Grid>
            </Grid>
        </Paper>
    )
}

export default Profile
