import React from 'react'
import {Button, FormControlLabel, Switch} from "@mui/material";
import {ros} from '../Utils/ros';

export default class CommandButtons extends React.Component {

    constructor(props) {
        super(props);
        this.ros = props.ros;
        this.rc = this.props.store.robotReducer.robot;
        this.state = {
            connectionStatus: this.props.store.robotReducer.robot.connectionStatus,
            connectionState: this.props.store.robotReducer.robot.connectionState,
            moveStatus: this.props.store.robotReducer.robot.moveStatus,
            moveState: this.props.store.robotReducer.robot.moveState,
            navigate: this.props.store.robotReducer.robot.navigate
        }
    }

    storeMove = (status, state) => {
        this.props.dispatch({
            type: 'HANDLE_SET_MOVE',
            data: {moveStatus: status, moveState: state}
        });

        this.setState({
            moveState: this.props.store.robotReducer.robot.moveState,
            moveStatus: this.props.store.robotReducer.robot.moveStatus
        });
    }
    handleStand = () => {
        ros.publish(
            "/stand_cmd",
            'std_msgs/Bool',
            {data: true}
        );
    }

    handleIdle = () => {
        if(this.props.store.robotReducer.robot.moveState === 2){
            this.handleStand();
        }
        ros.publish(
            "/idle_cmd",
            'std_msgs/Bool',
            {data: true}
        );
    }

    handleWalk = () => {
        ros.publish(
            "/walk_cmd",
            'std_msgs/Bool',
            {data: true}
        );
    }

    socketConnect = () => {
        if (this.state.connectionState) {
            this.ros.socket.onclose();
        } else {
            this.ros.socket.onopen();
        }
    }

    handleNavigate =() => {
        fetch(`http://${this.rc.robot_ip}:${this.rc.robot_port}/${this.rc.api_path}/launch/start/?pkg=spot_micro_launch&file=motion_control_and_hector_slam.launch`, {
            method: 'GET'
        }).then((res) => {
            this.setState({navigate: true});
            this.props.dispatch({
                type: 'HANDLE_SET_NAVIGATE',
                data: true
            });
        });
    }

    render() {
        return <>
            {
                this.props.store.robotReducer.robot.connectionState ?
                    <>
                        <FormControlLabel control={<Switch onChange={this.handleNavigate} checked={this.state.navigate}/>} label="Navigation" />

                        <Button
                            variant={"outlined"}
                            style={{backgroundColor: '#FFF'}}
                            sx={{display: {md: 'flex'}, mr: 1}}
                            onClick={this.handleStand}
                        >
                            Stand
                        </Button>
                        <Button
                            variant={"outlined"}
                            style={{backgroundColor: '#FFF'}}
                            sx={{display: {md: 'flex'}, mr: 1}}
                            onClick={this.handleWalk}
                        >
                            Walk
                        </Button>
                        <Button
                            variant={"outlined"}
                            style={{backgroundColor: '#FFF'}}
                            sx={{display: {md: 'flex'}, mr: 1}}
                            onClick={this.handleIdle}
                        >
                            Idle
                        </Button>
                    </>

                :null
            }

            <Button
                color={this.props.store.robotReducer.robot.connectionState ? "success" : "warning"}
                variant={"outlined"}
                style={{backgroundColor: '#FFF'}}
                onClick={this.socketConnect}>
                {this.props.store.robotReducer.robot.connectionStatus}
            </Button>
        </>
    }
}
