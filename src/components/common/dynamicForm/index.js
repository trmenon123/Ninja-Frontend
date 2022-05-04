import React, {useState} from "react";
import PropTypes from 'prop-types';


// Material UI imports
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import Alert from '@mui/material/Alert';

const DynamicForm = (props)=> {
    const [state, setState] = useState({
        fields: props.formFields.map((element)=> {
                    return {...element, value: ''}
                }), 
        validator: false
    });
    
    const updateChange = (index, event)=> {
        const initial = state.fields;
        initial[index] = {...initial[index], value: event.target.value};
        setState({...state, fields: initial});
        
    }

    const handleButtonClick = ()=> {
        const data = props.isSignin === true?
            {
                email: state.fields.find((element)=> {
                    return element.key === 'signin-email'
                })['value'],
                password: state.fields.find((element)=> {
                    return element.key === 'signin-password'
                })['value'],
            }
            :
            {
                firstName: state.fields.find((element)=> {
                    return element.key === 'signup-first-name'
                })['value'],
                lastName: state.fields.find((element)=> {
                    return element.key === 'signup-last-name'
                })['value'],
                email: state.fields.find((element)=> {
                    return element.key === 'signup-email'
                })['value'],
                address: state.fields.find((element)=> {
                    return element.key === 'signup-address'
                })['value'],
                password: state.fields.find((element)=> {
                    return element.key === 'signup-password-initial'
                })['value'],
            };
        if(props.isSignin === true) {
            setState({...state, validator: false})
            props.submitForm(data);
        }
        // Validations for password match
        if(props.isSignin === false) {
            if(data.password === state.fields.find((element)=> {
                return element.key === 'signup-password-confirm'
            })['value']) {
                setState({...state, validator: false})
                props.submitForm(data);
            }else {
                setState({...state, validator: true})
            }
        }
    }

    return (
        <Box 
            sx={{width: '100%'}}
        >
            {state.validator === true?
                <Alert variant="filled" severity="error">
                    Password do not match
                </Alert>: ''
            }
            {Array.isArray(state.fields) && state.fields.length > 0 ?
                <React.Fragment>
                    {state.fields.map((element, index)=> {
                        return (
                            <Box key={element.key} sx={{my:2, px: 2}}>
                                <TextField 
                                    id={element.key} 
                                    label={element.label} 
                                    type={element.type}
                                    value={element.value}
                                    variant="outlined"
                                    fullWidth
                                    onChange= {(event)=>updateChange(index, event)}
                                />
                            </Box>                            
                        )
                    })}
                    <Divider/>
                    <Button 
                        variant="outlined"
                        color='secondary'
                        size='large'
                        startIcon={props.isSignin === true? <VpnKeyOutlinedIcon/>:<HowToRegOutlinedIcon/>}
                        onClick = {handleButtonClick}
                        sx={{my: 2}}
                    >
                        {props.isSignin === true? "Sign in": "Sign up"}
                    </Button>
                </React.Fragment>
                :
                <React.Fragment></React.Fragment>
                
            }
        </Box>
    );
}

DynamicForm.propTypes= {
    isSignin: PropTypes.bool.isRequired,
    formFields: PropTypes.array.isRequired,
    submitForm: PropTypes.func.isRequired
}

DynamicForm.defaultProps = {
    isSignin: true,
    formFields: [],
    submitForm: ()=> {}
}

export default DynamicForm;