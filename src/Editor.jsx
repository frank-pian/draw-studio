import React, { Component } from 'react';
import AceEditor from "react-ace";
import PubSub from 'pubsub-js';
import DrawexeModule from './drawexeModule';
import { ShowLoading } from './contextManager'

import "ace-builds/src-noconflict/mode-tcl";
import "ace-builds/src-noconflict/snippets/tcl";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/ext-language_tools"

import './Editor.css'

class Editor extends Component {
    // static contextType = ShowLoading;
    constructor(props) {
        super(props);
        this.aceRef = React.createRef();
        this.state = {
            text: `pload MODELING VISUALIZATION OCAF XDE
box b 0 -20 -10 100 40 20
compound b b b a
explode a
trotate a_1 0 0 0 1 0 0 60
trotate a_2 0 0 0 1 0 0 -60
bcommon b a a_1
bcommon b b a_2

pcylinder c 4 100
trotate c 0 0 0 0 1 0 90

psphere s 1.4
ttranslate s 99.2 0 0
bfuse cx c s

pcone e 60 0.5 101
trotate e 0 0 0 0 1 0 90

bcommon body b e
bcut body body c
bcommon core cx e

text2brep text "CAD Assistant" -font Times -height 10
ttranslate text 10 -4 10
prism tr text 0 0 -1
bfuse body body tr

donly body core

#vdisplay body core
#vsetcolor body yellow
#vsetcolor core red

explode body so
explode body_1 f
explode core so

NewDocument D
XAddShape D body_1
XAddShape D core_1

for {set i 1} {$i <= 26} {incr i} {XSetColor D body_1_$i BLUE}
XSetColor D body_1_1 E68066
XSetColor D body_1_9 E68066
for {set i 10} {$i <= 22} {incr i} {XSetColor D body_1_$i 99B300}
XSetColor D core_1 1A1AFF
foreach ff [explode core_1 f] { XSetColor D $ff 1A1AFF ; puts "set color $ff" }

vclear
vinit View1
XDisplay -dispMode 1 D -explore
vfit
vrenderparams -msaa 8
vbackground -color WHITE`,
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
        } else if (this.state.currentRow > this.state.codeRow) {
            //run end
            this.resetState();
            this.props.onState(false);
            return false;
        } else {
            this.props.onState(false);
            return false;
        }
    }
    resetState() {
        this.setState({
            codeRow: 0,
            markers: [],
            currentRow: 0
        });
    }
    updateText(newValue) {
        this.setState({
            text: newValue
        });
    }
    getKeywordNumber(cmd, keyword) {
        let num = 0;
        if (cmd) {
            let arr = cmd.split(keyword);
            num = arr.length - 1;
        }
        return num;
    }
    componentDidMount() {
        PubSub.unsubscribe("/editor/runCode");
        PubSub.subscribe("/editor/runCode", () => {
            this.context.setLoadingStatus(true);
            setTimeout(() => {
                const codeFile = new File([this.state.text], "code.tcl", {
                    type: "text/plain",
                });
                DrawexeModule.uploadFile(codeFile, "", true, () => {
                    DrawexeModule.eval2(['source', 'code.tcl']).then(() => {
                        this.context.setLoadingStatus(false);
                    });

                });
            }, 100)
        });

        PubSub.unsubscribe("/editor/debugCode/start");
        PubSub.subscribe("/editor/debugCode/start", () => {
            const row = this.aceRef.current.editor.session.getLength();
            if (row > 0) {
                this.setState({
                    codeRow: row
                });
            }
            this.props.onState(true);
        });

        PubSub.unsubscribe("/editor/debugCode/next");
        PubSub.subscribe("/editor/debugCode/next", async () => {
            let startRow = this.state.currentRow;
            let endRow = this.state.currentRow;
            let currentCode = this.aceRef.current.editor.session.getLine(endRow);
            while (!await DrawexeModule.isComplete(currentCode) || currentCode.endsWith("\\")) {
                endRow = endRow + 1;
                currentCode = currentCode + "\n" + this.aceRef.current.editor.session.getLine(endRow);
            }
            console.log(currentCode);
            if (currentCode) {
                PubSub.publish("/drawexe/eval", currentCode);
            }
            if (this.uploadState) {
                this.setState({
                    markers: [{ startRow: startRow, startCol: 0, endRow: endRow, endCol: 99999, className: 'current-line', type: 'text' }],
                });
            } else {
                this.resetState();
            }
            startRow = startRow + 1;
            endRow = endRow + 1;
            this.setState({ currentRow: endRow });
            this.uploadState();
        });

        PubSub.unsubscribe("/editor/debugCode/stop");
        PubSub.subscribe("/editor/debugCode/stop", () => {
            this.resetState();
            this.uploadState();
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
Editor.contextType = ShowLoading;
export default Editor;