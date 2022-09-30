import React from "react";
import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CommandButtons from "./CommandButtons";
import BatteryGauge from 'react-battery-gauge'
import {ros} from "../Utils/ros";

export default class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            battery: 100
        }
    }

    componentDidMount() {
        setTimeout(() => {
            ros.consume('/battery', 'std_msgs/Float32',
                msg => {
                    this.setState({battery: msg.data})
                    this.props.dispatch({
                        type: 'HANDLE_SET_BATTERY',
                        data: msg.data
                    });
                }
            )
        }, 3000);
    }

    render() {
        return (
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    {/*<BugReportIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>*/}
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        RoboDog
                    </Typography>
                    <CommandButtons dispatch={this.props.dispatch} store={this.props.store}/>
                    <BatteryGauge
                        value={this.state.battery}
                        orientation={'horizontal'}
                        size={120}
                        padding={10}
                        charging={false}
                    />
                </Toolbar>
            </AppBar>
        )
    }
}
