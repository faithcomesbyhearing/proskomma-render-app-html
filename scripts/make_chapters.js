import fse from 'fs-extra';
import path from 'path';

import { ScriptureParaModel } from 'proskomma-render';
import AppHtmlDocSetModel from "../AppHtmlDocSetModel.js";
import AppHtmlDocumentModel from "../AppHtmlDocumentModel.js";

if (process.argv.length !== 3) {
    throw new Error("USAGE: node make_chapter.js <srcDirPath>");
}

const srcDirPath = process.argv[2];
const toRenderPath = path.resolve(path.join(srcDirPath, "toRender.json"));
if (!fse.pathExists(toRenderPath)) {
    throw new Error(`toRenderJson not found in '${srcDirPath}': generate this using make_render_json.js`);
}
const toRender = fse.readJsonSync(toRenderPath);

const context = {};
const config = {};
const documentModel = new AppHtmlDocumentModel(toRender, context, config);
const docSetModel = new AppHtmlDocSetModel(toRender, context, config);
const processingModel = new ScriptureParaModel(toRender, config);
docSetModel.addDocumentModel('default', documentModel);
processingModel.addDocSetModel('default', docSetModel);

processingModel.render();
