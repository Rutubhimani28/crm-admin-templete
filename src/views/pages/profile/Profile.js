// ** React Imports
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-hot-toast'

// ** MUI Components
import {
    Card,
    CardHeader,
    CardContent,
    Grid,
    TextField,
    Button,
    Avatar,
    Box,
    Typography,
    Divider,
    IconButton,
    Paper,
    InputAdornment,
    FormControl,
    InputLabel,
    OutlinedInput,
    FormHelperText
} from '@mui/material'

// ** Icons
import { Camera, Save, Edit, Mail, Phone, Building, Briefcase, User } from 'react-feather'

// ** Custom Components
import PageHeader from '@components/page-header'

const Profile = () => {
    // ** States
    const [avatar, setAvatar] = useState(null)
    const [isEditing, setIsEditing] = useState(false)

    // ** Hooks
    const dispatch = useDispatch()
    const userData = useSelector((state) => state.authentication.userData)

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            fullName: userData?.fullName || '',
            email: userData?.email || '',
            phone: userData?.phone || '',
            company: userData?.company || '',
            designation: userData?.designation || ''
        }
    })

    useEffect(() => {
        if (userData) {
            reset({
                fullName: userData.fullName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                company: userData.company || '',
                designation: userData.designation || ''
            })
        }
    }, [userData, reset])

    const onSubmit = async (data) => {
        try {
            // TODO: Add API call to update profile
            toast.success('Profile updated successfully')
            setIsEditing(false)
        } catch (error) {
            toast.error('Failed to update profile')
        }
    }

    const handleAvatarChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setAvatar(e.target.result)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div>
            <PageHeader
                title="Profile"
                subtitle="View and edit your profile information"
            />

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Grid container spacing={6}>
                    {/* Avatar Section */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 3,
                            backgroundColor: 'background.paper',
                            borderRadius: 2,
                            boxShadow: 1
                        }}>
                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                <Avatar
                                    src={avatar || userData?.avatar}
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
                                    <IconButton
                                        component="span"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            backgroundColor: 'primary.main',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'primary.dark'
                                            }
                                        }}
                                    >
                                        <Camera size={20} />
                                    </IconButton>
                                </label>
                            </Box>
                            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                                {userData?.fullName}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                                {userData?.designation}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {userData?.company}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Profile Information */}
                    <Grid item xs={12} md={8}>
                        <form onSubmit={handleSubmit(onSubmit)}>
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
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name="fullName"
                                                control={control}
                                                rules={{ required: 'Full name is required' }}
                                                render={({ field }) => (
                                                    <FormControl fullWidth error={Boolean(errors.fullName)}>
                                                        <InputLabel>Full Name</InputLabel>
                                                        <OutlinedInput
                                                            {...field}
                                                            disabled={!isEditing}
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <User size={20} />
                                                                </InputAdornment>
                                                            }
                                                            label="Full Name"
                                                        />
                                                        {errors.fullName && (
                                                            <FormHelperText>{errors.fullName.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name="email"
                                                control={control}
                                                rules={{
                                                    required: 'Email is required',
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: 'Invalid email address'
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <FormControl fullWidth error={Boolean(errors.email)}>
                                                        <InputLabel>Email</InputLabel>
                                                        <OutlinedInput
                                                            {...field}
                                                            disabled={!isEditing}
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <Mail size={20} />
                                                                </InputAdornment>
                                                            }
                                                            label="Email"
                                                        />
                                                        {errors.email && (
                                                            <FormHelperText>{errors.email.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name="phone"
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControl fullWidth error={Boolean(errors.phone)}>
                                                        <InputLabel>Phone</InputLabel>
                                                        <OutlinedInput
                                                            {...field}
                                                            disabled={!isEditing}
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <Phone size={20} />
                                                                </InputAdornment>
                                                            }
                                                            label="Phone"
                                                        />
                                                        {errors.phone && (
                                                            <FormHelperText>{errors.phone.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name="company"
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControl fullWidth error={Boolean(errors.company)}>
                                                        <InputLabel>Company</InputLabel>
                                                        <OutlinedInput
                                                            {...field}
                                                            disabled={!isEditing}
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <Building size={20} />
                                                                </InputAdornment>
                                                            }
                                                            label="Company"
                                                        />
                                                        {errors.company && (
                                                            <FormHelperText>{errors.company.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name="designation"
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControl fullWidth error={Boolean(errors.designation)}>
                                                        <InputLabel>Designation</InputLabel>
                                                        <OutlinedInput
                                                            {...field}
                                                            disabled={!isEditing}
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <Briefcase size={20} />
                                                                </InputAdornment>
                                                            }
                                                            label="Designation"
                                                        />
                                                        {errors.designation && (
                                                            <FormHelperText>{errors.designation.message}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>

                                        {isEditing && (
                                            <Grid item xs={12}>
                                                <Divider sx={{ my: 2 }} />
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => {
                                                            setIsEditing(false)
                                                            reset()
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        startIcon={<Save size={20} />}
                                                    >
                                                        Save Changes
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </form>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}

export default Profile 