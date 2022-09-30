import React from "react";
import {ros} from "../Utils/ros";
import {CircularProgress, IconButton, Paper} from "@mui/material";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

export default class InfraDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.rc = this.props.store.robotReducer.robot;
        this.state = {
            image: '',
            progress: false
        };
    }

    handleInfraCamera = () => {
        this.setState({progress: true});
        fetch(`http://${this.rc.robot_ip}:${this.rc.robot_port}/${this.rc.api_path}/launch/start/?pkg=realsense2_camera&file=rs_camera.launch`, {
            method: 'GET'
        }).then((res) => {
            setTimeout(() => {
                ros.consume('/camera/infra1/image_rect_raw/compressed', 'sensor_msgs/CompressedImage',
                    msg => {
                        this.setState({image: "data:image/jpg;base64," + msg.data})
                    }
                );
            }, 2000);
        });
    }

    renderImage = () => {
        if (this.state.progress === false) {
            return <IconButton aria-label="delete">
                <PlayCircleOutlineIcon onClick={this.handleInfraCamera} />
            </IconButton>;
        } else {
            if (this.state.image === '') {
                return <CircularProgress/>;
            } else {
                return <Paper
                    variant="outlined" square style={{
                    minHeight: 320,
                    height: '100%',
                    backgroundImage: `url(${this.state.image})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                }}
                />;
            }
        }
    }

    render() {
        return <this.renderImage/>;
    }
}
