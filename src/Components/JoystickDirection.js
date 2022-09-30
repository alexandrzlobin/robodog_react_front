import React from "react";
import ReactNipple from "react-nipple";
import {ros} from "../Utils/ros";
import {Chip} from "@mui/material";

export default class JoystickDirection extends React.Component {

    constructor(props) {
        super(props);

        this.linear_speed = 0;
        this.angular_speed = 0;

        this.max_linear = 0.16; // m/s
        this.max_angular = 0.1 // rad/s
        this.max_distance = 75.0; // pixels;

        this.state = {
            linear: 0,
            angular: 0
        }
    }

    storeMove = (status, state) => {
        this.props.dispatch({
            type: 'HANDLE_SET_MOVE',
            data: {moveStatus: status, moveState: state}
        });
    }

    handleWalk = () => {
        ros.publish(
            "/walk_cmd",
            'std_msgs/Bool',
            {data: true}
        );
        this.storeMove(2, 'Walk');
        console.log(this.props.store.robotReducer.robot.moveState)
    }

    handleJoystickSpeedWalk = (event, data) => {

        if (this.props.store.robotReducer.robot.moveState === 2) {

            this.linear_speed = Math.sin(data.angle.radian) * this.max_linear * data.distance / this.max_distance;
            this.angular_speed = -Math.cos(data.angle.radian) * this.max_angular * data.distance / this.max_distance;

            ros.publish(
                "/cmd_vel",
                'geometry_msgs/Twist',
                {
                    linear: {
                        x: this.linear_speed,
                        y: 0,
                        z: 0
                    },
                    angular: {
                        x: 0,
                        y: 0,
                        z: this.angular_speed
                    }
                }
            )

            this.setState({
                linear: this.linear_speed,
                angular: this.angular_speed
            });
        }
    }

    handleStand = () => {
            ros.publish(
                "/stand_cmd",
                'std_msgs/Bool',
                {data: true}
            );
            this.storeMove(1, 'Stand');

        this.setState({
            linear: 0,
            angular: 0
        });

    }

    render() {
        return <>
            <Chip label={`lin: ${this.state.linear.toFixed(1)} ang: ${this.state.angular.toFixed(1)}`} color="primary"/>
            <ReactNipple className={'joystick'}
                         options={{
                             size: 180,
                             color: '#000',
                             mode: 'static',
                             position: {top: '50%', left: '50%'},
                             dynamicPage: true
                         }}
                         style={{
                             width: '100%',
                             height: 250
                         }}
                         onMove={(event, data) => this.handleJoystickSpeedWalk(event, data)}
                         onEnd={this.handleStand}
                         onStart={this.handleWalk}
            />
        </>
    }
}
