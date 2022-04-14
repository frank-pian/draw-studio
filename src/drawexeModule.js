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
    static isComplete(cmd) {
        return new Promise((resolve, reject) => {
            this.getInstance().then(module => {
                resolve(module.isComplete(cmd));
            }).catch((e) => {
                reject(e);
            });
        });
    }
    static async uploadFile(fileObject, theFilePath, theToPreload, sccuessFunc) {
        await this.getInstance().then(module => {
            let aReader = new FileReader();
            aReader.onload = () => {
                let aFilePath = theFilePath;
                if (aFilePath === "") {
                    aFilePath = fileObject.name;
                }
                let aDataArray = new Uint8Array(aReader.result);
                PubSub.publish('/console/print', `Uploading file ${fileObject.name} of size ${aDataArray.length} bytes to ${aFilePath}...`);
                module.FS.writeFile(aFilePath, aDataArray);
                if (theToPreload) {
                    module.FS.createPreloadedFile(!aFilePath.startsWith("/") ? module.FS.cwd() : "/",
                        aFilePath,
                        aDataArray, true, true,
                        sccuessFunc,
                        () => { throw new Error("Preload failed") }, true);
                }
            }
            aReader.readAsArrayBuffer(fileObject);
        });
    }
}

PubSub.subscribe("/drawexe/eval", (msg, data) => {
    DrawexeModule.eval(data);
});
export default DrawexeModule;