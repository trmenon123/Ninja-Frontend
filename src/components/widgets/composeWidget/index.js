import React, { Component} from "react";
import config from '../../../constants/config.json';
import moment from "moment";
import { DynamicNavigator } from "../../common";

// Service Imports
import {createNewNote, uploadFile, downloadFile} from '../../../services';

// Material UI imports
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';

class ComposeWidgetComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            note: {image: '', title: '', content: ''},
            snackbar: {open: false, isError: false, message: ''},
            created: null,
            upload: {status: false, resource: ''}
        };
    }

    componentDidMount() {
        // console.log("Compose Widget mounted");
    }

    componentDidUpdate() {
        // console.log("Compose Widget updated");
        // console.log(this.state);
    }

    handleChange= (event)=> {
        if(event.target.id === "note-title") {
            this.setState({...this.state, note:{...this.state.note, title: event.target.value}});
        }
        if(event.target.id === "note-content") {
            this.setState({...this.state, note:{...this.state.note, content: event.target.value}});
        }
    }

    handleClick = ()=> {
        try{            
            if(this.state.step === 0) {
                if(
                    this.state.note.title.length === 0 ||
                    this.state.note.content.length === 0
                ) {                    
                    this.setState({
                        ...this.state,
                        snackbar: {
                            open: true, 
                            isError: true, 
                            message: 'Note title and content can not be empty'
                        }
                    });
                }else {
                    const newNote = {
                        createdBy: JSON.parse(localStorage.user)['userId'],
                        title: this.state.note.title,
                        content: this.state.note.content
                    };
                    createNewNote(newNote).subscribe({
                        next: (response)=> {
                            if(response.success === true) {
                                this.setState({
                                    ...this.state,
                                    created: response?.data?._id, 
                                    step: 1
                                });
                            }else {
                                this.setState({
                                    ...this.state,
                                    snackbar: {
                                        open: true, 
                                        isError: true, 
                                        message: response?.message
                                    }
                                });
                            }
                        },
                        error: (error)=> {
                            console.log("[NEWNOTE-API] Creating new note error");
                            console.log(error);
                            this.setState({
                                ...this.state,
                                snackbar: {
                                    open: true, 
                                    isError: true, 
                                    message: 'Unexpected error'
                                }
                            });
                        }
                    })                    
                }                
            }
            if(this.state.step === 1) {
                if(this.state.upload.status === true && this.state.created.length > 0) {
                    const formData = new FormData();
                    formData.append("file", this.state.upload.resource);
                    uploadFile(this.state.created, formData).subscribe({
                        next: (response)=> {
                            if(response.success === true) {
                                downloadFile(response?.data?.data?.mediaUrl).subscribe({
                                    next: (resp)=> {
                                        this.setState({
                                            ...this.state,
                                            note: {
                                                ...this.state.note,
                                                image: URL.createObjectURL(resp)
                                            },
                                            step: 2,
                                            upload:{status: false, resource: ''},
                                            snackbar: {
                                                open: true, 
                                                isError: false, 
                                                message: 'Image uploaded successfully'
                                            }
                                        });
                                                                                
                                    },
                                    error: (err)=> {
                                        console.log("[ERROR: DOWNLOAD] Unable to download uploaded file");
                                        console.log(err);
                                    },
                                })                                
                            }
                            if(response.success === false) {
                                this.setState({
                                    ...this.state,
                                    snackbar: {
                                        open: true, 
                                        isError: true, 
                                        message: response.message
                                    }
                                });
                            }
                        },
                        error: (error)=> {
                            console.log("[ERROR: UPLOAD] Error while uploading image");
                            console.log(error);
                            this.setState({
                                ...this.state,
                                snackbar: {
                                    open: true, 
                                    isError: true, 
                                    message: "Unexpect error while uploading file"
                                }
                            });
                        },
                    })
                }

                if(this.state.upload.status === false) {
                    this.setState({...this.state, step: 2});
                }               
            }
        }catch(err) {
            console.log("[ERROR] compose button click");
            console.log(err);
        }
    }

    handleCloseSnackbar = ()=> {
        this.setState({
            ...this.state, 
            snackbar: {open: false, isError: false, message: ''}
        });
    }

    render() {
        return(
            <React.Fragment>
                <Snackbar 
                    open={this.state.snackbar.open} 
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    autoHideDuration={6000} 
                    onClose={this.handleCloseSnackbar}
                >
                    <Alert 
                        severity={this.state.snackbar.isError === true? 'error': 'success'} 
                        sx={{ width: '100%' }}
                    >
                        {this.state.snackbar.open=== true? this.state.snackbar.message: ''}
                    </Alert>
                </Snackbar>
                <Box sx={{ width: '100%', my: 4 }}>
                    <Stepper 
                        activeStep={this.state.step}
                        alternativeLabel={true}
                    >
                        {config.composeSteps.map((element) => {
                            return (
                                <Step 
                                    key={element.key} 
                                    active={this.state.step === element.key? true: false}
                                >
                                    <StepLabel>{element?.label}</StepLabel>
                                </Step>
                            )
                        })}
                    </Stepper>
                </Box>
                <Card sx={{ width: '100%' }}>
                    <CardHeader
                        avatar={
                            this.state.note.image.length === 0?
                                <Avatar 
                                    sx={{ bgcolor: red[500] }} 
                                    aria-label="recipe"
                                >
                                    <InsertPhotoOutlinedIcon />
                                </Avatar>
                                :
                                <Avatar
                                    alt="Image Preview Thumbnail"
                                    src={this.state.note.image}
                                    sx={{ width: 56, height: 56 }}
                                />
                        }                        
                        title={this.state.note.title.length === 0?
                            "New Document": this.state.note.title
                        }
                        subheader={moment().format('ll')}
                    />
                    <Divider/>
                    <CardContent>
                        <Input 
                            accept="image/*" 
                            id="icon-button-file" 
                            type="file"
                            disableUnderline
                            fullWidth
                            inputComponent={TextField}
                            inputProps={{variant: "filled",color: "secondary",fullWidth: true,}}
                            onChange={(event)=> {
                                this.setState({
                                    ...this.state,
                                    upload: {
                                        status: true,
                                        resource: event.target.files[0],
                                    }
                                })
                            }}
                            sx={{display: this.state.step === 1? 'block': 'none', my: 2}}
                        />
                        <TextField 
                            id="note-title" 
                            label="Title" 
                            type="text"
                            value={this.state.note.title}
                            disabled={this.state.step === 0? false: true}
                            variant="standard"
                            fullWidth
                            onChange= {this.handleChange}
                            sx={{mt: 4}}
                        />
                        <TextField 
                            id="note-content" 
                            label="Note" 
                            type="text"
                            multiline={true}
                            rows={6}
                            value={this.state.note.content}
                            disabled={this.state.step === 0? false: true}
                            variant="outlined"
                            fullWidth
                            onChange= {this.handleChange}
                            sx={{my: 1}}
                        />
                    </CardContent>
                    <CardActions>
                        {this.state.step === 2?
                            <DynamicNavigator
                                label= "Save and Exit"
                                route= "home"
                                disabled= {false}
                            />
                            :
                            <Button 
                                size="small"
                                variant="outlined"
                                color="secondary"
                                onClick={this.handleClick}
                            >
                                Proceed
                            </Button>
                        }                        
                    </CardActions>
                </Card>
            </React.Fragment>   
            
        )
    }
}

export default ComposeWidgetComponent;