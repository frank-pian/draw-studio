// import createDRAWEXE from "./DRAWEXE.js";
import PubSub from "pubsub-js";

class DrawexeModule {
    constructor() {
        this.module = null;
        this.loaded = false;
        this.drawModule = [];
        // this.getInstance();
    }
    static async getInstance(func) {
        if (!this.instance) {
            this.instance = this;
            const module = await window.createDRAWEXE({
                noExitRuntime: true,
                print: func,
                canvas: window.document.getElementById('occViewerCanvas')
            })
            this.instance.loaded = true;
            this.instance.module = module;

            return module;

        }
        return this.instance.module
    }
    static async eval(cmd) {
        if (!this.loaded) {
            return;
        }
        let evalCmd = "";
        if (cmd instanceof Array) {
            evalCmd = cmd.join(" ");
        } else {
            evalCmd = cmd;
        }

        console.log(evalCmd, "[Input]");
        await this.getInstance().then(module => {
            return module.eval(evalCmd);
        });
    }
    static async uploadFile(fileObject, theFilePath, theToPreload) {
        await this.getInstance().then(module => {
            let aReader = new FileReader();
            aReader.onload = () => {
                let aFilePath = theFilePath;
                if (aFilePath === "") {
                    aFilePath = fileObject.name;
                }
                let aDataArray = new Uint8Array(aReader.result);
                PubSub.publish('/console/print', `Uploading file ${fileObject.name} of size ${aDataArray.length} bytes to ${aFilePath}...`);
                //module.FS.writeFile(aFilePath, aDataArray);
                if (theToPreload) {
                    console.log(!aFilePath.startsWith("/") ? module.FS.cwd() : "/");
                    module.FS.createPreloadedFile(!aFilePath.startsWith("/") ? module.FS.cwd() : "/",
                        aFilePath,
                        aDataArray, true, true,
                        () => { console.log("preload sccuess") },
                        () => { throw new Error("Preload failed") });
                }
            }
            aReader.readAsArrayBuffer(fileObject);
        });
    }
}

export default DrawexeModule;