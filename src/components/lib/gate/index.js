import React, {useState} from "react";
import { v4 as uuid4 } from "uuid";
import { useNavigate  } from "react-router-dom";
import { authenticateUser, signoutUser } from "../../../authentication";
import { NavigationBar, DynamicForm} from '../../common';

// Material UI imports
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// Services import
import {signin, signout, signup} from '../../../services';


function GateComponent(){
    // Handling prelim inits
    const clearInit = async()=> {
        signoutUser();
        signout().subscribe({
            next: (data)=> {
                if(data?.success === true) {
                    console.log("Signout api acheived");
                }
            },
            error: (error)=> {
                console.log("ERROR");
                console.log(error);
            }
        });
    }
    // Clearing cookie, localstorage and session
    clearInit();
    const navigate = useNavigate();

    const [state, setState] = useState({
        signin:[
            {key: 'signin-email',type: 'email', label: 'Email'},
            {key: 'signin-password',type: 'password', label: 'Password'},
        ],
        signup: [
            {key: 'signup-first-name',type: 'text', label: 'First Name'},
            {key: 'signup-last-name',type: 'text', label: 'Last Name'},
            {key: 'signup-email',type: 'email', label: 'Email'},
            {key: 'signup-address',type: 'text', label: 'Address'},
            {key: 'signup-password-initial',type: 'password', label: 'Passowrd'},
            {key: 'signup-password-confirm',type: 'password', label: 'Confirm Passowrd'},
        ],
        selected: 0,
        snackbar: {open: false, isError: false, message: ''}
    });
    
    const handleTabChange = (event, newValue) => {
        setState({...state, selected: newValue});
    };

    const submitForm = (data)=> {
        if(data) {
            if(state.selected === 0) {
                signinDriver(data);
            }
            if(state.selected === 1) {
                signupDriver(data);
            }
        }
    }

    const signinDriver = (data)=> {
        try {
            signin(data).subscribe({
                next: (response)=> {
                    if(response.success === true) {
                        const authData = { token : response?.token, user : response?.data };
                        const auth = authenticateUser(authData);
                        if(auth === true) {
                            navigate("/user/home");
                        }
                    }else {
                        setState({
                            ...state,
                            snackbar: {
                                ...state.snackbar, 
                                open: true, 
                                isError: true, 
                                message: response?.message
                            },
                            selected: response.success === true? 1: 0
                        });
                    }
                },
                error: (error)=> {
                    console.log("[ERROR: SIGNIN] Exception caught");
                    console.log(error);
                },
            })
        }catch(err){
            console.log("[ERROR] Unable to signin: EXCEPTION in api");
        }        
    }

    const signupDriver = (data)=> {
        try {
            signup(data).subscribe({
                next: (response)=> {
                    if(response) {
                        setState({
                            ...state,
                            snackbar: {
                                ...state.snackbar, 
                                open: true, 
                                isError: response?.success === true? false: true, 
                                message: response?.message
                            },
                            selected: response.success === true? 1: 0
                        });
                    }
                },
                error: (error)=> {
                    setState({
                        ...state,
                        snackbar: {
                            ...state.snackbar, 
                            open: true, 
                            isError: true, 
                            message: 'Sign up failed. Please try again'
                        }
                    });
                },
            })
        }catch(err){
            console.log("[ERROR] Unable to signin: EXCEPTION in api");
            console.log(err);
        }        
    }

    const handleCloseSnackbar = ()=> {
        setState({
            ...state,
            snackbar: {...state.snackbar, open: false, isError: false, message: ''}
        });
    }

    return (
        <React.Fragment>            
            <NavigationBar showControls={false}/>
            <Snackbar 
                open={state.snackbar.open} 
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
            >
                <Alert 
                    severity={state.snackbar.isError === true? 'error': 'success'} 
                    sx={{ width: '100%' }}
                >
                    {state.snackbar.open=== true? state.snackbar.message: ''}
                </Alert>
            </Snackbar>
            <Box
                sx={{
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mt: 4,
                    px: {xs: '10px', sm: '40px', md: '80px', lg: '100px'}
                }}
            >
                <Paper 
                    elevation={6}
                    sx={{
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: {xs: '100%', sm: '80%', md: '60%', lg: '50%'}
                    }}
                >
                    <Stack spacing={2} sx={{width: '100%'}}>
                        <Tabs 
                            value={state.selected} 
                            onChange={handleTabChange} 
                            aria-label="basic tabs example"
                        >
                            <Tab 
                                label="Sign in"
                                value={0} 
                            />
                            <Tab 
                                label="Sign up"
                                value={1} 
                            />
                        </Tabs>

                        <Box sx={{mt: 2, width: '100%'}}>
                            {state.selected === 0?
                                <DynamicForm
                                    key={uuid4()}
                                    isSignin={true}
                                    formFields={state.signin}
                                    submitForm={submitForm}
                                />
                                :
                                <DynamicForm
                                    key={uuid4()}
                                    isSignin={false}
                                    formFields={state.signup}
                                    submitForm={submitForm}
                                />
                            }                            
                        </Box>
                        
                    </Stack>
                </Paper>
            </Box>
        </React.Fragment>
    );
}

export default GateComponent;