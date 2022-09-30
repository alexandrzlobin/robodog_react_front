import React from "react";
import ReactNipple from "react-nipple";
import {ros} from "../Utils/ros";
import {Chip} from "@mui/material";

export default class JoystickBalance extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            x: 0,
            y: 0,
            z: 0
        };

        this.linear_speed = 0;
        this.angular_speed = 0;
        this.max_linear = 0.4; // m/s
        this.max_angular = 0.4 // rad/s
        this.max_distance = 75.0; // pixels;

        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    handleBalanceZero = () => {
        ros.publish(
            "/angle_cmd",
            'geometry_msgs/Vector3',
            {
                x: 0,
                y: 0,
                z: 0
            }
        )

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.setState({
            x: 0, y: 0, z: 0
        });
    }

    handleJoystickBalance = (event, data) => {

        this.y = Math.sin(data.angle.radian) * this.max_linear * data.distance / this.max_distance;
        this.x = Math.cos(data.angle.radian) * this.max_angular * data.distance / this.max_distance;

        ros.publish(
            "/angle_cmd",
            'geometry_msgs/Vector3',
            {
                x: this.x,
                y: this.y,
                z: this.z
            }
        );

        this.setState({
            x: this.x, y: this.y, z: this.z
        });

    }

    render() {
        return <>
            <Chip label={`x: ${this.state.x.toFixed(1)} y: ${this.state.y.toFixed(1)} z: ${this.state.z.toFixed(1)} `} color="primary" />
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
                         onMove={(event, data) => this.handleJoystickBalance(event, data)}
                         onEnd = {this.handleBalanceZero}
            />
        </>
    }
}
