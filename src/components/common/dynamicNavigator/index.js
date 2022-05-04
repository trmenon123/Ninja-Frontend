import React from "react";
import PropTypes from 'prop-types';
import { useNavigate  } from "react-router-dom";

// Material UI imports
import Button from '@mui/material/Button';

const DynamicNavigator = (props)=> {
    const navigate = useNavigate();  

    const handleNavigate = ()=> {
        navigate(`/user/${props.route}`);
    }

    return (
        <Button
            onClick={handleNavigate}
            sx={{ my: 2,  display: 'block'}}
            variant="outlined"
            color="secondary"
            disabled={props.disabled}
        >
            {props.label}
        </Button>
    );
}

DynamicNavigator.propTypes= {
    label: PropTypes.string.isRequired,
    route: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired
}

DynamicNavigator.defaultProps = {
    label: "",
    route: "",
    disabled: false
}

export default DynamicNavigator;