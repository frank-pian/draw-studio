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
    static eval2(cmd) {
        return new Promise((resolve, reject) => {
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
            this.getInstance().then(module => {
                resolve(module.eval(evalCmd));
            }).catch((e) => {
                reject(e);
            });
        });
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
    static downloadFile(fileNamePath) {
        let fileName = fileNamePath;
        let pathSplit = fileNamePath.split("/");
        if (pathSplit > 1) {
            fileName = pathSplit[pathSplit.length - 1];
        }
        let aNameLower = fileNamePath.toLowerCase();
        let aType = "application/octet-stream";
        if (aNameLower.endsWith(".png")) {
            aType = "image/png";
        }
        else if (aNameLower.endsWith(".jpg")
            || aNameLower.endsWith(".jpeg")) {
            aType = "image/jpeg";
        }
        this.getInstance().then(module => {
            try {
                let data = module.FS.readFile(fileNamePath);
                PubSub.publish('/console/print', `Downloading file ${fileName} of size ${data.length} bytes...`);
                this.downloadDataFile(data, fileName, aType);
            } catch (e) {
                PubSub.publish('/console/print', `Error: file ${fileNamePath} cannot be read with ${e}`);
            }
        });
    }

    /**
   * Function to download data to a file.
   * @param[in] {Uint8Array} theData data to download
   * @param[in] {string} theFileName default file name to download data as
   * @param[in] {string} theType data MIME type
   */
    static downloadDataFile(theData, theFileName, theType) {
        let aFileBlob = new Blob([theData], { type: theType });
        let aLinkElem = document.createElement("a");
        let anUrl = URL.createObjectURL(aFileBlob);
        aLinkElem.href = anUrl;
        aLinkElem.download = theFileName;
        document.body.appendChild(aLinkElem);
        aLinkElem.click();
        setTimeout(function () {
            document.body.removeChild(aLinkElem);
            window.URL.revokeObjectURL(anUrl);
        }, 0);
    }

    static showRootDir() {
        this.getInstance().then(module => {
            for(const fsFileName of module.FS.readdir('/')) {
                PubSub.publish('/console/print', fsFileName);
            }
        });
    }

    

    static deleteFile(fileName) {
        this.getInstance().then(module => {
            module.FS.unlink(fileName);
            PubSub.publish('/console/print', "delete "+fileName);
        });
    }
}

/**
 * @param {string} cmd command
 */
PubSub.subscribe("/drawexe/eval", (msg, cmd) => {
    if (cmd === "") {
        return;
    }
    if (cmd.startsWith("#")) {
        return;
    }
    const cmdList = cmd.split(" ");
    switch (cmdList[0]) {
        case "jsdownload":
            DrawexeModule.downloadFile(cmdList[1]);
            break;
        case "remove":
            DrawexeModule.deleteFile(cmdList[1]);
            break;
        case "ls":
            DrawexeModule.showRootDir();
            break;
        default:
            DrawexeModule.eval(cmd);
            break;
    }
});
export default DrawexeModule;