import * as path from "path";
import { cwd } from "process";

let root = cwd();

let ControllerDataEnum = {
    STATIC_DIR_PATH: path.join(root, "/static"),
    VIEWS_DIR_PATH: path.join(root, "/views")
};

for (let [propertyName] of Object.entries(ControllerDataEnum)) {
    Object.defineProperty(ControllerDataEnum, propertyName, { writable: false });
}

export default ControllerDataEnum;