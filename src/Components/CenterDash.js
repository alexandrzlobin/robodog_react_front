import React from "react";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ColorDisplay from "./ColorDisplay";
import InfraDisplay from "./InfraDisplay";

export default class CenterDash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 0
        }
    }

    TabPanel = (props) => {
        const {children, value, index} = props;

        return (
            <div
                role="tabpanel"
                hidden={this.state.tab !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                style={{minHeight: 320}}
            >
                {this.state.tab === index && (
                    <>{children}</>
                )}
            </div>
        );
    }

    a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    handleChangeTab = (event, value) => {
        this.setState({tab: value});
    }

    render() {
        return <>
            <Tabs value={this.state.tab} onChange={this.handleChangeTab} variant="fullWidth" centered>
                <Tab label="Color" {...this.a11yProps(0)} />
                <Tab label="Infra" {...this.a11yProps(1)}/>
                <Tab label="Objects" {...this.a11yProps(2)}/>
                <Tab label="Map" {...this.a11yProps(3)}/>
            </Tabs>
            <this.TabPanel value={1} index={0}>
                <ColorDisplay dispatch={this.props.dispatch} store={this.props.store}/>
            </this.TabPanel>
            <this.TabPanel value={2} index={1}>
                <InfraDisplay dispatch={this.props.dispatch} store={this.props.store}/>
            </this.TabPanel>
            <this.TabPanel value={3} index={2}>
                Item Three
            </this.TabPanel>
            <this.TabPanel value={4} index={3}>
                Item Three
            </this.TabPanel>
        </>
    }
}
