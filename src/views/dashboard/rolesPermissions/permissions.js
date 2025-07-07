import React, { useState, useEffect } from 'react';
import {
    Box, Card, Typography, Checkbox, Table, TableHead, TableRow,
    TableCell, TableBody, FormControlLabel, Button, CircularProgress, Alert
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getRolePermissions, updateRoles } from '../../../redux/rolesPermissions';
import { ChevronLeft } from 'react-feather';

const moduleList = [
    { name: 'Dashboard', permissions: ['view'] },
    { name: 'Contacts', permissions: ['create', 'edit', 'view', 'delete'] },
    { name: 'Leads', permissions: ['create', 'edit', 'view', 'delete'] },
    { name: 'Customer', permissions: ['create', 'edit', 'view', 'delete'] },
    { name: 'Team', permissions: ['create', 'edit', 'view', 'delete'] },
];

const getDefaultPermissions = () => {
    return moduleList.reduce((acc, module) => {
        acc[module.name] = module.permissions.reduce((pAcc, perm) => {
            pAcc[perm] = perm === 'view'; // enable 'view' by default
            pAcc[perm] = false;
            return pAcc;
        }, { allowAll: false });
        return acc;
    }, {});
};

const Permissions = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [permissions, setPermissions] = useState(getDefaultPermissions());
    const [initialPermissions, setInitialPermissions] = useState(getDefaultPermissions());
    const [allowAllModules, setAllowAllModules] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [roleName, setRoleName] = useState('');

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                setLoading(true);
                setError(null);

                const roleData = await dispatch(getRolePermissions(id));
                const apiPermissions = roleData?.payload?.permissions || {};

                const mergedPermissions = getDefaultPermissions();
                Object.keys(mergedPermissions).forEach(module => {
                    if (apiPermissions[module]) {
                        mergedPermissions[module] = {
                            ...mergedPermissions[module],
                            ...apiPermissions[module],
                            allowAll: moduleList.find(m => m.name === module)?.permissions
                                .every(perm => apiPermissions[module][perm]) || false
                        };
                    }
                });

                setPermissions(mergedPermissions);
                setInitialPermissions(JSON.parse(JSON.stringify(mergedPermissions)));

                const allAllowed = moduleList.every(module =>
                    mergedPermissions[module.name]?.allowAll === true
                );
                setAllowAllModules(allAllowed);
            } catch (err) {
                console.error('Fetch Error:', err);
                setError('Failed to load permissions. Please try again.');
                setPermissions(getDefaultPermissions());
                setInitialPermissions(getDefaultPermissions());
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();

        const permissionData = localStorage.getItem("createdRole");
        if (permissionData) {
            try {
                const role = JSON.parse(permissionData); // it's a single object, not an array
                if (role._id === id) {
                    setRoleName(role.roleName);
                } else {
                    console.warn("No matching role found for id:", id);
                }
            } catch (parseError) {
                console.error("Failed to parse localStorage data:", parseError);
            }
        }
    }, [id, dispatch]);

    const handlePermissionToggle = (moduleName, permission) => {
        setPermissions(prev => {
            const updated = {
                ...prev,
                [moduleName]: {
                    ...prev[moduleName],
                    [permission]: !prev[moduleName][permission]
                }
            };

            const modulePerms = moduleList.find(m => m.name === moduleName).permissions;
            updated[moduleName].allowAll = modulePerms.every(p => updated[moduleName][p]);

            setAllowAllModules(
                moduleList.every(module => updated[module.name]?.allowAll)
            );

            return updated;
        });
        setSuccess(false);
    };

    const handleModuleAllowAll = (moduleName) => {
        setPermissions(prev => {
            const moduleConfig = moduleList.find(m => m.name === moduleName);
            const newAllowAll = !prev[moduleName].allowAll;

            const updated = { ...prev };
            updated[moduleName] = { ...updated[moduleName] };

            moduleConfig.permissions.forEach(perm => {
                updated[moduleName][perm] = newAllowAll;
            });
            updated[moduleName].allowAll = newAllowAll;

            setAllowAllModules(
                moduleList.every(module => updated[module.name]?.allowAll)
            );

            return updated;
        });
        setSuccess(false);
    };

    const handleAllowAllModules = () => {
        const newState = !allowAllModules;
        setPermissions(prev => {
            const updated = { ...prev };
            moduleList.forEach(({ name, permissions: perms }) => {
                updated[name] = { ...updated[name] };
                perms.forEach(p => {
                    updated[name][p] = newState;
                });
                updated[name].allowAll = newState;
            });
            return updated;
        });
        setAllowAllModules(newState);
        setSuccess(false);
    };

    // Save changes
    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            const payload = {
                _id: id,
                permissions: {}
            };

            moduleList.forEach(module => {
                payload.permissions[module.name] = {
                    ...permissions[module.name]
                };
                delete payload.permissions[module.name].allowAll;
            });

            await dispatch(updateRoles({
                updatedData: payload,
                paginationModel: { page: 0, pageSize: 10 }
            })).unwrap();

            // Update initial permissions to current state
            setInitialPermissions(JSON.parse(JSON.stringify(permissions)));
            setSuccess(true);
        } catch (err) {
            console.error('Save Error:', err);
            setError(err.message || 'Failed to save permissions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = JSON.stringify(permissions) !== JSON.stringify(initialPermissions);

    return (
        <Box p={3}>
            <Box className="d-flex justify-content-between align-items-center mt-1 mb-1">
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Role Permissions Management
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                        Role: <span style={{ color: 'green' }}>{roleName || 'Unknown Role'}</span>
                        {/* Role: <span style={{ color: 'green' }}>{roleName || 'Unknown Role'}</span> (ID: <span style={{ color: 'red' }}>{id}</span>) */}
                    </Typography>
                </Box>
                <Button color="primary" onClick={() => navigate(-1)}>
                    <ChevronLeft className="mr-2" />
                    Back
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>Permissions saved successfully!</Alert>}

            <Card sx={{ mt: 2, p: 3 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={allowAllModules}
                                    onChange={handleAllowAllModules}
                                />
                            }
                            label="Allow All Modules"
                            sx={{ mb: 3 }}
                        />

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell><strong>Module</strong></TableCell>
                                    <TableCell><strong>Sub Module</strong></TableCell>
                                    {['create', 'edit', 'view', 'delete'].map(perm => (
                                        <TableCell key={perm} align="center"><strong>{perm.toUpperCase()}</strong></TableCell>
                                    ))}
                                    <TableCell align="center"><strong>Allow All</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {moduleList.map(({ name, permissions: perms }) => {
                                    const modulePermissions = permissions[name] || {};
                                    const someChecked = perms.some(p => modulePermissions[p]);
                                    const allChecked = perms.every(p => modulePermissions[p]);

                                    return (
                                        <TableRow key={name} hover>
                                            <TableCell>
                                                <Checkbox
                                                    checked={allChecked}
                                                    indeterminate={someChecked && !allChecked}
                                                    onChange={() => handleModuleAllowAll(name)}
                                                />
                                            </TableCell>
                                            <TableCell>{name}</TableCell>
                                            <TableCell>{name}</TableCell>
                                            {['create', 'edit', 'view', 'delete'].map(perm => (
                                                <TableCell key={perm} align="center">
                                                    {perms.includes(perm) ? (
                                                        <Checkbox
                                                            checked={modulePermissions[perm] || false}
                                                            onChange={() => handlePermissionToggle(name, perm)}
                                                        />
                                                    ) : (
                                                        <span style={{ color: '#999' }}>—</span>
                                                    )}
                                                </TableCell>
                                            ))}
                                            <TableCell align="center">
                                                <Checkbox
                                                    checked={modulePermissions.allowAll || false}
                                                    onChange={() => handleModuleAllowAll(name)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        <Box mt={4} display="flex" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={!hasChanges || loading}
                                startIcon={loading ? <CircularProgress size={20} /> : null}
                            >
                                {loading ? 'Saving...' : 'Save Permissions'}
                            </Button>
                        </Box>
                    </>
                )}
            </Card>
        </Box>
    );
};

export default Permissions;