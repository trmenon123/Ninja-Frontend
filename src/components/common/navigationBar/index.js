import React, {useState} from "react";
import PropTypes from 'prop-types';
import { signout } from "../../../services";
import { signoutUser } from "../../../authentication";
import { useNavigate  } from "react-router-dom";
import config from '../../../constants/config.json';


// Material UI imports
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { lightGreen } from "@mui/material/colors";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const NavigationBar = (props)=> {
    const navigate = useNavigate(); 
    const [state, setState] = useState({
        open: false, 
        anchor: null, 
        selectedTab: 1,
        user: props.showControls === true? 
            JSON.parse(localStorage.user)['firstName']+ " " + JSON.parse(localStorage.user)['lastName']
            : 'Annonymous'
    });

    const handleOpenMenu = (event) => {
        setState({...state, open: true, anchor: event.currentTarget});
    };

    const handleCloseMenu = () => {
        setState({...state, open: false, anchor: null, });
    };

    const handleTabChange = (data, value) => {
        setState({...state, selectedTab: value});
        const newValue = config.services.find((element)=> {
            return element.id === value
        })['route']; 
        navigate(`/user${newValue}`);
    };

    const handleSignout = ()=> {
        signoutUser();
        signout().subscribe({
            next: (data)=> {
                if(data?.success === true) {
                    alert("You have been logged out");
                    navigate("/");                    
                }
            },
            error: (error)=> {
                console.log("ERROR");
                console.log(error);
            }
        });
    }

    return (
        <React.Fragment>            
            <AppBar position="static" color="primary">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: 'flex' }}
                        >
                            <Avatar
                                alt="Fresh Harvest" 
                                sx={{ bgcolor: lightGreen[500], width: 46, height: 46 }}
                            >
                                N                   
                            </Avatar>
                            Ninja
                        </Typography>

                        {props.showControls === true?
                            <Box 
                                sx={{ 
                                    flexGrow: 1, 
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center'
                                }}
                            >
                                <Tabs                                 
                                    value={state.selectedTab} 
                                    onChange={handleTabChange} 
                                    textColor="secondary"
                                    indicatorColor="secondary"
                                    aria-label="basic tabs example"
                                >
                                    {config.services.map((element) => {
                                        return(
                                            <Tab 
                                                key={element.id}
                                                value={element.id}
                                                label={element.label}
                                                sx={{color: '#fff'}}
                                            />
                                        )
                                    })}
                                </Tabs>
                            </Box> : ""
                        }
                        

                        {props.showControls === true? 
                            <Box sx={{ flexGrow: 0 }}>
                                <Chip 
                                    label={state.user}
                                    icon={<AccountCircleOutlinedIcon />}
                                    variant="filled" 
                                    onClick={handleOpenMenu} 
                                    color='secondary'
                                    size='small'
                                />
                                <Menu
                                    id="basic-menu"
                                    anchorEl={state.anchor}
                                    open={state.open}
                                    onClose={handleCloseMenu}
                                    MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem
                                        divider={true} 
                                        onClick={handleSignout}
                                        sx={{m:2}}
                                    >
                                        <ListItemIcon>
                                            <ExitToAppIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>Signout</ListItemText>
                                    </MenuItem>
                                </Menu>
                            </Box>: ""
                        }
                        
                    </Toolbar>
                </Container>
            </AppBar>
        </React.Fragment>
    );
}

NavigationBar.propTypes= {
    showControls: PropTypes.bool.isRequired,
}

NavigationBar.defaultProps = {
    showControls: false,
}

export default NavigationBar;