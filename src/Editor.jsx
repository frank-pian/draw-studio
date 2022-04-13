import React, { Component } from 'react';
import AceEditor from "react-ace";
import PubSub from 'pubsub-js';
import DrawexeModule from './drawexeModule';

import "ace-builds/src-noconflict/mode-tcl";
import "ace-builds/src-noconflict/snippets/tcl";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/ext-language_tools"

import './Editor.css'

class Editor extends Component {
    constructor(props) {
        super(props);
        this.aceRef = React.createRef();
        this.state = {
            text: `pload MODELING VISUALIZATION
vinit View1

# Create box with specified origin and dimensions.
# Tip: BRepPrimAPI_MakeBox origin is at lower-left corner.
set aBoxOrig {  0 -300   0}
set aBoxDims {100  50  100}
box b -min {*}$aBoxOrig -size {*}$aBoxDims
vdisplay -dispMode 1 b
vaspects b -color CYAN -faceBoundary 1 -faceBoundaryColor BLACK
vtrihedron bt -origin {*}$aBoxOrig`,
            codeRow: 0,
            markers: [],
            currentRow: 0
        }
        this.updateText = this.updateText.bind(this);
        this.uploadState = this.uploadState.bind(this)
    }
    uploadState() {
        if ((this.state.codeRow !== 0) && (this.state.currentRow <= this.state.codeRow)) {
            this.props.onState(true);
            return true;
        } else {
            this.props.onState(false);
            return false;
        }
    }
    updateText(newValue) {
        //console.log("change", newValue);
        this.setState({
            text: newValue
        });
    }
    componentDidMount() {
        PubSub.unsubscribe("/editor/runCode");
        PubSub.subscribe("/editor/runCode", () => {
            const codeFile = new File([this.state.text], "code.tcl", {
                type: "text/plain",
            });
            DrawexeModule.uploadFile(codeFile, "", true, () => {
                DrawexeModule.eval(['source', 'code.tcl']);
            });

        });

        PubSub.unsubscribe("/editor/debugCode/start");
        PubSub.subscribe("/editor/debugCode/start", () => {
            const row = this.aceRef.current.editor.session.getLength()
            if (row > 0) {
                this.setState({
                    codeRow: row,
                    markers: [{ startRow: 0, startCol: 0, endRow: 0, endCol: 99999, className: 'current-line', type: 'text' }],
                });
                console.log(this.aceRef.current.editor.session.getLine(0));
            }
            this.uploadState();
        });

        PubSub.unsubscribe("/editor/debugCode/next");
        PubSub.subscribe("/editor/debugCode/next", () => {
            const cmd = this.aceRef.current.editor.session.getLine(this.state.currentRow);
            if (cmd) {
                PubSub.publish("/drawexe/eval", cmd);
            }
            this.setState({ currentRow: this.state.currentRow + 1 });
            if (this.uploadState) {
                this.setState({
                    markers: [{ startRow: this.state.currentRow, startCol: 0, endRow: this.state.currentRow, endCol: 99999, className: 'current-line', type: 'text' }],
                });
            } else {
                this.setState({
                    codeRow: 0,
                    markers: [],
                    currentRow: 0
                });
            }
            this.uploadState();
        });

        PubSub.unsubscribe("/editor/debugCode/stop");
        PubSub.subscribe("/editor/debugCode/stop", () => {
            this.setState({
                codeRow: 0,
                markers: [],
                currentRow: 0
            });
            this.uploadState();
            console.log("editor", this.uploadState());
        });
    }
    render() {
        return <AceEditor
            ref={this.aceRef}
            style={{ "width": "100%", "height": "100%" }}
            mode="tcl"
            theme="twilight"
            onChange={this.updateText}

            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showPrintMargin: false
            }}
            value={this.state.text}
            markers={this.state.markers}
        />;
    }
}
export default Editor;