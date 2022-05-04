import React, { Component} from "react";
import moment from "moment";
// Service Imports
import { getAllNotes, downloadFile, updateNote} from '../../../services';

// Material UI imports
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

class HomeWidgetComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
          filter: {status: false, value: ''},
          tableData: {count: 0, data: []},
          selected: {status: false, data: {}},
          contentModal: {open: false, isEdit: false},
          imageModal: {open: false, title: '', resource: ''},
          snackbar: {open: false, isError: false, message: ''}
        };
    }

    componentDidMount() {
        // console.log("Home Widget mounted");
        this.populateItems();
    }

    componentDidUpdate() {
        // console.log("Home Widget updated");
        // console.log(this.state);
    }

    populateItems = ()=> {
        const data = {
            userId: JSON.parse(localStorage.user)['userId'],
            isFilter: this.state?.filter?.status,
            filterTitle: this.state?.filter?.status === true? this.state?.filter?.value: ''
        };
        try {
            getAllNotes(data).subscribe({
                next: (response)=> {
                    if(response?.success === true) {
                        this.setState({
                            ...this.state, 
                            tableData: {
                                count: response.data?.count,
                                data: response?.data?.data
                            }
                        });
                    }
                },
                error: (error)=> {
                    console.log("[ERROR] Populating table data");
                    console.log(error);
                }
            });
        }catch(err) {
            console.log("[EXCEPTION] Populating table data api error");
            console.log(err);
        }        
    }

    handleChange= (event)=> {
        this.setState({
            ...this.state,
            filter: {
                status: event.target.value.length === 0? false: true,
                value: event.target.value
            }
        });
    }

    handleFilterReset = ()=> {
        this.setState({
            ...this.state,
            filter: {...this.state.filter, status: false, value: ''}
        }, ()=> {
            this.populateItems();
        })
    }

    handleCloseContentModal = ()=> {
        this.setState({
            ...this.state,
            selected: {status: false, data: {}},
            contentModal: {open: false, isEdit: false}
        });
    }

    handleView= (data)=> {
        try {
            if(data?.mediaPresent === true) {
                downloadFile(data?.mediaUrl).subscribe({
                    next: (response)=> {
                        this.setState({
                            ...this.state,
                            selected: {
                                status: true, 
                                data: {...data, mediaUrl: URL.createObjectURL(response)}
                            },
                            contentModal: {open: true, isEdit: false}
                        });
                    },
                    error: (error)=> {
                        console.log("[ERROR:API] Image download");
                        console.log(error);
                    }
                })
            }
            if(data?.mediaPresent === false) {
                this.setState({
                    ...this.state,
                    selected: {status: true, data: data},
                    contentModal: {open: true, isEdit: false}
                });
            }
        }catch(err) {
            console.log("[ERROR] Trying to create view modal");
            console.log(err);
        }
        
    }

    handleEdit= (data)=> {
        try {
            if(data?.mediaPresent === true) {
                downloadFile(data?.mediaUrl).subscribe({
                    next: (response)=> {
                        this.setState({
                            ...this.state,
                            selected: {
                                status: true, 
                                data: {...data, mediaUrl: URL.createObjectURL(response)}
                            },
                            contentModal: {open: true, isEdit: true}
                        });
                    },
                    error: (error)=> {
                        console.log("[ERROR:API] Image download");
                        console.log(error);
                    }
                })
            }
            if(data?.mediaPresent === false) {
                this.setState({
                    ...this.state,
                    selected: {status: true, data: data},
                    contentModal: {open: true, isEdit: true}
                });
            }
        }catch(err) {
            console.log("[ERROR] Trying to create view modal");
            console.log(err);
        }        
    }

    handleChangeContent = (event)=> {
        try {
            this.setState({
                ...this.state,
                selected: {
                    ...this.state.selected,
                    data: {...this.state.selected.data, content: event.target.value}
                }
            })
        }catch(err) {
            console.log("[ERROR] Changine content snapshot");
            console.log(err)
        }
    }

    handleUpdateContent= ()=> {
        const data = {
            noteId: this.state.selected.data?._id,
            data: {content: this.state.selected.data?.content}
        };
        if(this.state.selected?.status === true) {
            try {
                updateNote(data).subscribe({
                    next: (response)=> {
                        if(response?.success === true) {
                            this.setState({
                                ...this.state,
                                selected: {status: false, data: {}},
                                contentModal: {open: false, isEdit: false},
                                snackbar: {open: true, isError: false, message: response?.message}
                            }, ()=> {
                                this.populateItems();
                            });
                        }else {
                            this.setState({
                                ...this.state,
                                snackbar: {open: true, isError: true, message: response?.message}
                            })
                        }
                    },
                    error: (error)=> {
                        console.log("[ERROR] Error obj received from updation api");
                        console.log(error);
                        this.setState({
                            ...this.state,
                            snackbar: {open: true, isError: true, message: "Unexpected error occured"}
                        })
                    },
                })
            }catch(err) {
                console.log("[ERROR:UPDATING NOTES API] Trying to update note");
                console.log(err);
                this.setState({
                    ...this.state,
                    snackbar: {open: true, isError: true, message: "Unexpected error occured"}
                })
            }
        }
    }

    handleOpenImageModal = (data)=> {
        if(data?.mediaPresent === true) {
            try {
                downloadFile(data?.mediaUrl).subscribe({
                    next: (response)=> {
                        if(response instanceof Blob) {
                            this.setState({
                                ...this.state,
                                imageModal: {
                                    open: true, 
                                    title: data?.title, 
                                    resource: URL.createObjectURL(response)
                                }
                            })
                        }
                    },
                    error: (error)=> {
                        console.log("[ERROR:API] Returned err object");
                        console.log(error);
                    },
                })
            }catch(err) {
                console.log("[ERROR] Getting image from server");
                console.log(err);
            }
        }
    }

    handleCloseImageModal = ()=> {
        this.setState({...this.state, imageModal: {open: false, title: '', resource: ''}});
    }

    handleCloseSnackbar = ()=> {
        this.setState({
            ...this.state,
            snackbar: {open: false, isError: false, message: ''}
        })
    };

    render() {
        return(
            <React.Fragment>

                {/* VIEW and EDIT Modal */}
                <Dialog
                    open={this.state.contentModal.open}
                    TransitionComponent={Slide}
                    TransitionProps={{direction:'right'}}
                    keepMounted
                    fullWidth
                    scroll='paper'
                    onClose={this.handleCloseContentModal}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>                        
                        {this.state.selected?.status === true?
                            <Stack direction="row" spacing={2}>
                                {this.state.selected?.data?.mediaPresent === true?
                                    <Avatar
                                        alt="Image Preview Thumbnail"
                                        src={this.state.selected?.data?.mediaUrl}
                                        sx={{ width: 56, height: 56 }}
                                    />
                                    :
                                    <Avatar sx={{ bgcolor: deepPurple[500] }}>
                                        {this.state.selected?.data?.title[0]}
                                    </Avatar>
                                }
                                <Typography variant="button" display="block" gutterBottom>
                                    {this.state.selected?.data?.title}
                                </Typography>
                                <Typography variant="caption" display="block" gutterBottom>
                                    {moment(this.state.selected?.data?.createdAt).format('ll')}
                                </Typography>
                            </Stack>
                            :
                            "Nothing to show"
                        } 
                    </DialogTitle>
                    <Divider/>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {this.state.selected?.status === true?
                                this.state.contentModal?.isEdit === true?
                                    "Update content"
                                    :
                                    this.state.selected?.data?.content
                                :
                                "Nothing to show here"
                            }
                        </DialogContentText>
                        
                        {this.state.selected?.status === true?
                            this.state.contentModal?.isEdit === true?
                                <TextField 
                                    id="note-content" 
                                    label="Note" 
                                    type="text"
                                    multiline={true}
                                    rows={6}
                                    value={this.state.selected?.data?.content}
                                    variant="outlined"
                                    fullWidth
                                    onChange= {this.handleChangeContent}
                                    sx={{mt: 4}}
                                />
                                :
                                ""
                            :
                            "Nothing to show here"
                        }                        
                    </DialogContent>
                    <Divider/>
                    <DialogActions>
                        {this.state.selected?.status === true?
                            this.state.contentModal?.isEdit === true?
                                <Button 
                                    variant="outlined"
                                    color="secondary"
                                    onClick={this.handleUpdateContent}
                                >
                                    Save and close
                                </Button>
                                :
                                ""
                            :
                            "Nothing to show here"
                        }               
                        
                    </DialogActions>
                </Dialog>

                {/* IMAGE Modal */}
                <Dialog
                    open={this.state.imageModal.open}
                    TransitionComponent={Slide}
                    TransitionProps={{direction:'left'}}
                    keepMounted
                    fullWidth
                    scroll='paper'
                    onClose={this.handleCloseImageModal}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{this.state.imageModal?.title}</DialogTitle>
                    <Divider/>
                    <DialogContent>
                        <img 
                            src={this.state.imageModal?.resource} 
                            alt="Preview"
                            width='500'
                        />
                    </DialogContent>
                </Dialog>

                {/* Snackbar toaster */}
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

                <Paper 
                    elevation={6}
                    sx={{my: 2, width: '100%'}}
                >
                    <Box sx={{ m: 2, py: 4 }}>
                        <Grid container spacing={2} >
                            <Grid 
                                item
                                sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} 
                                xs={12} lg={6}
                            >
                                <TextField 
                                    id="note-title-filter" 
                                    label="Filter by Title" 
                                    type="text"
                                    value={this.state.filter.value}
                                    variant="outlined"
                                    helperText="Enter correct title"
                                    fullWidth
                                    onChange= {this.handleChange}
                                    sx={{mt: 2}}
                                />
                            </Grid>
                            <Grid 
                                item
                                sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}} 
                                xs={12} lg={6}
                            >
                                <Stack 
                                    direction={{xs:'column', sm: 'column', md:'row'}} 
                                    spacing={2}
                                >
                                    <Button 
                                        variant="outlined" 
                                        color="secondary"
                                        startIcon={<FilterListIcon />}
                                        onClick={this.populateItems}
                                    >
                                        Filter Results
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        color="secondary"
                                        startIcon={<FilterListOffIcon />}
                                        onClick={this.handleFilterReset}
                                    >
                                        Turn off Filters
                                    </Button>
                                </Stack>                                
                            </Grid>
                        </Grid>
                    </Box>
                    
                </Paper>
                <Box sx={{width: '100%'}}>
                    <TableContainer component={Paper}>
                        <Table sx={{ width: '100%' }} aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">Title</TableCell>
                                    <TableCell align="left">Created</TableCell>
                                    <TableCell align="left">Updated</TableCell>
                                    <TableCell align="left">Media</TableCell>
                                    <TableCell align="left">View</TableCell>
                                    <TableCell align="left">Edit</TableCell>
                                </TableRow>
                            </TableHead>
                                <TableBody>
                                    {this.state.tableData?.count === 0?
                                        <TableRow key="EMPTYTABLE">
                                            <TableCell align="left" colSpan={6}>
                                                <Alert 
                                                    severity='warning' 
                                                    sx={{ width: '100%' }}
                                                >
                                                    Your search filter returned 0 results
                                                </Alert>
                                            </TableCell>                                        
                                        </TableRow>
                                        :
                                        this.state.tableData.data.map((element) => {
                                            return (
                                                <TableRow
                                                    key={element._id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="left">
                                                        {element.title}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {moment(element.createdAt).format('ll')}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {moment(element.updatedAt).format('ll')}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {element.mediaPresent === true?
                                                            <IconButton 
                                                                aria-label="edit" 
                                                                color="secondary"
                                                                onClick={()=> {this.handleOpenImageModal(element)}}
                                                            >
                                                                <PhotoSizeSelectActualOutlinedIcon />
                                                            </IconButton>
                                                            : 
                                                            <Typography variant="caption">
                                                                No Media
                                                            </Typography>
                                                        }
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <IconButton 
                                                            aria-label="view" 
                                                            color="secondary"
                                                            onClick={()=>{this.handleView(element)}}
                                                        >
                                                            <RemoveRedEyeOutlinedIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <IconButton 
                                                            aria-label="edit" 
                                                            color="secondary"
                                                            onClick={()=> {this.handleEdit(element)}}
                                                        >
                                                            <EditOutlinedIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </React.Fragment>   
            
        )
    }
}

export default HomeWidgetComponent;