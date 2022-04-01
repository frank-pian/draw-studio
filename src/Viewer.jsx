import React, { Component } from 'react';

class Viewer extends Component {
    render() {
        return <canvas id="occViewerCanvas" style={{ width: "100%", height: "100%", border: "0 none", backgroundColor: "#000" }} />;
    }
}

export default Viewer;