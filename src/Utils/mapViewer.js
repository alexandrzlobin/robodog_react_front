import * as ROS3D from "ros3d";
import {ros} from './ros';


class RosMap {


    mapViewer = (container, width, height) => {
        let viewer = new ROS3D.Viewer({
            divID: container,
            width: width,
            height: height,
            antialias: true
        });

        // Setup the map client.
        new ROS3D.OccupancyGridClient({
            ros: ros.connect(),
            rootObject: viewer.scene
        });

        return viewer;

    }
}

export const rosMap = new RosMap();
