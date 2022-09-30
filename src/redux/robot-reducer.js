let initState = {
    robot:{
        connectionStatus: 'Disconnected',
        connectionState: false,
        moveStatus: 'Idling',
        moveState: 0,
        mapRender: false,
        anglePos: {
            x:0,
            y:0,
            z:0
        },
        image: null,
        robot_ip: window.location.hostname,
        robot_port: 8000,
        ws_port: 9090,
        gui_path: 'roswww',
        api_path: 'api',
        navigate: false,
        battery: 100

    }
}

const robotReducer = (state = initState, action) => {
    switch (action.type) {
        case 'HANDLE_SET_CONNECTION':
            state.robot.connectionStatus = action.data.connectionStatus;
            state.robot.connectionState = action.data.connectionState;
            return state;
        case 'HANDLE_SET_MOVE':
            state.robot.moveStatus = action.data.moveStatus;
            state.robot.moveState = action.data.moveState;
            return state;
        case 'HANDLE_SET_MAP':
            state.robot.mapRender = action.data.mapRender;
            return state;
        case 'HANDLE_SET_ANGLE':
            state.robot.anglePos = action.data;
            return state;
        case 'HANDLE_SET_IMAGE':
            state.robot.image = action.data;
            return state;
        case 'HANDLE_SET_NAVIGATE':
            state.robot.navigate = action.data;
            return state;
        case 'HANDLE_SET_BATTERY':
            state.robot.battery = action.data;
            return state;
        default:
            return state;
    }
};

export default robotReducer;
