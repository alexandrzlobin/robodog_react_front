import RosLib from "roslib";
//import * as ROS2D from "ros2d";
import * as ROS3D from "ros3d";
import store from '../redux/store-redux';

class Ros {

    connect = async (params) => {
        await new Promise((resolve, reject) => {
            this.ros = new RosLib.Ros({
                url: `ws://${params.ip}:${params.port}`
            });

            this.ros.socket.addEventListener('open', (event) => {
                console.log('WebSocket Client Connected');
                resolve();
            });

            this.ros.socket.addEventListener('error', (event) => {
                console.log('WebSocket Client Error');
                reject();
            });

            this.ros.socket.addEventListener('message', (message) => {
                //console.log(message);
            });

            this.ros.socket.addEventListener('close', () => {
                console.log('WebSocket Client Closed');
            });
        });

        // this.consume('/idle_cmd', 'std_msgs/Bool', msg => store.dispatch({
        //     type: 'HANDLE_SET_MOVE',
        //     data: {
        //         moveStatus: 'Idle',
        //         moveState: 0
        //     }
        // }));
        //
        // this.consume('/stand_cmd', 'std_msgs/Bool', msg => store.dispatch({
        //     type: 'HANDLE_SET_MOVE',
        //     data: {
        //         moveStatus: 'Stand',
        //         moveState: 1
        //     }
        // }));
        //
        // this.consume('/walk_cmd', 'std_msgs/Bool', msg => store.dispatch({
        //     type: 'HANDLE_SET_MOVE',
        //     data: {
        //         moveStatus: 'Walk',
        //         moveState: 2
        //     }
        // }));

        this.consume('/map', 'nav_msgs/OccupancyGrid', msg => store.dispatch({
                type: 'HANDLE_SET_MAP',
                data: {
                    mapRender: true
                }
            }),
            msg => store.dispatch({
                type: 'HANDLE_SET_MAP',
                data: {
                    mapRender: false
                }
            })
        );

        this.consume('/angle_cmd', 'geometry_msgs/Vector3', msg => store.dispatch({
            type: 'HANDLE_SET_ANGLE',
            data: {
                x: msg.x,
                y: msg.y,
                z: msg.z
            }
        }));

        // this.consume('/camera/color/image_raw', 'sensor_msgs/CompressedImage',
        //     msg => store.dispatch({
        //             type: 'HANDLE_SET_IMAGE',
        //             data: "data:image/jpg;base64," + msg.data
        //         }
        //     )
        // );

    }

    someFunc = (msg) => {
        console.log(msg)
    }

    publish = (name, type, params) => {
        new RosLib.Topic({
            ros: this.ros,
            name: name,
            messageType: type
        }).publish(new RosLib.Message(params));
    }

    consume = (name, type, handler) => {
        let listener = new RosLib.Topic({
            ros: this.ros,
            name: name,
            messageType: type,
        });

        listener.subscribe(function (message) {
            //console.log('Received message on ' + listener.name + ': ' + message.data);
            handler(message);
        });
        // listener.unsubscribe(function (message) {
        //     handler(message);
        // });
    }

    mapViewer = (container, width, height) => {
        let viewer = new ROS3D.Viewer({
            divID: container,
            width: width,
            height: height,
            antialias: true
        });

        let tfClient = new RosLib.TFClient({
            ros: this.ros,
            angularThres: 0.01,
            transThres: 0.01,
            rate: 10.0,
            fixedFrame: 'laser_base_link'//laser_base_link
        });

        var scanclient = new ROS3D.LaserScan({
            ros: this.ros,
            topic: '/scanR',
            tfClient: tfClient,
            rootObject: viewer.scene,
            material: {size: 0.05, color: 0xff00ff}
        });

        // // Setup the map client.
        let gridClient = new ROS3D.OccupancyGridClient({
            ros: this.ros,
            rootObject: viewer.scene
        });

        return viewer;

    }

}

export const ros = new Ros();
