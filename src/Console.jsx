import React, { useState, useEffect } from 'react';
import PubSub from 'pubsub-js';
import Terminal, { ColorMode, LineType } from 'react-terminal-ui';
import DrawexeModule from './drawexeModule'
import './Console.css'

function useDidMount(fn) {
    useEffect(fn, []);
}

function Console() {
    const [terminalLineData, setTerminalLineData] = useState([
        { type: LineType.Output, value: 'Welcome to the Draw Harness Studio!' }
    ]);

    let disabledInput = false;

    useDidMount(() => {
        disabledInput = true;
        terminalOutput("Loading wasm file...");
        DrawexeModule.getInstance(addLd).then(module => {
            disabledInput = false;
            terminalOutput("Loading completed");
        });
    });
    useDidMount(() => {
        PubSub.subscribe('/console/print', (message, data) => {
            terminalOutput(data);
        });
    });


    function terminalOutput(str) {
        setTerminalLineData(prev => [...prev, { type: LineType.Output, value: str }]);
    }

    function addLd(str) {
        console.log(str);
        setTerminalLineData(prev => [...prev, { type: LineType.Output, value: str }]);
    }

    function onInput(input) {
        if (disabledInput) {
            return;
        }
        setTerminalLineData(prev => [...prev, { type: LineType.Input, value: input }]);
        if (input.toLocaleLowerCase() === 'clear') {
            setTerminalLineData([]);
        }
        DrawexeModule.eval(input);
    }
    return (
        <Terminal
            colorMode={ColorMode.Dark}
            lineData={terminalLineData}
            onInput={onInput}
        />
    )
}

export default Console;