import React from 'react'
import './App.css';
import {Alert, Grid, Paper, Snackbar} from "@mui/material";
import 'react-nipple/lib/styles.css';
import {ros} from './Utils/ros';
import Header from "./Components/Head";
import JoystickDirection from "./Components/JoystickDirection";
import JoystickBalance from "./Components/JoystickBalance";
import CenterDash from "./Components/CenterDash";


export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.connectionSetttings = {ip: this.props.store.robotReducer.robot.robot_ip, port: this.props.store.robotReducer.robot.ws_port};
        this.state = {
            moveStatus: 0,
            notify: {open: false, message: '', variant: 'success'},
            connectionState: false,
            processed: false
        }
    }

    async componentDidMount() {
        if(!this.props.store.robotReducer.robot.connectionState){
            try {
                await ros.connect(this.connectionSetttings);
                this.props.dispatch({
                    type: 'HANDLE_SET_CONNECTION',
                    data: {connectionStatus: 'Connected', connectionState: true}
                });
                //ros.mapViewer('map', 800, 600);
                this.setState({notify: {open: true, message: 'Connection success!', variant: 'success'}, connectionState: true});

            } catch (e) {
                console.log('Socket error');
                this.props.dispatch({
                    type: 'HANDLE_SET_CONNECTION',
                    data: {connectionStatus: 'Disconnected', connectionState: false}
                });
                this.setState({notify: {open: true, message: e.message, variant: 'warning'}, connectionState: false});
            }
        }
    }

    render() {
        return (
            <>
                <Grid container spacing={2} justifyContent="space-around" alignItems="flex-start">
                    <Grid item xs={12}>
                        <Header dispatch={this.props.dispatch} store={this.props.store}/>
                    </Grid>
                    <Grid item xs={2} className={"JoyStick"} style={{textAlign: 'center'}}>
                        <JoystickDirection dispatch={this.props.dispatch} store={this.props.store}/>
                    </Grid>
                    <Grid item xs={6} style={{textAlign: "center", verticalAlign: 'center'}}>
                            <CenterDash dispatch={this.props.dispatch} store={this.props.store}/>
                    </Grid>
                    <Grid item xs={2} style={{textAlign: "center"}} className={"JoyStick"}>
                        <JoystickBalance dispatch={this.props.dispatch} store={this.props.store}/>
                    </Grid>
                </Grid>
                <Snackbar
                    autoHideDuration={15000}
                    open={this.state.notify.open}
                    onClose={() => this.setState({notify: {open: false, message: ''}})}
                    sx={{ width: "80%" }}
                >
                    <Alert severity={this.state.notify.variant} sx={{ width: "100%" }}>{this.state.notify.message}</Alert>
                </Snackbar>
            </>
        );
    }
}
