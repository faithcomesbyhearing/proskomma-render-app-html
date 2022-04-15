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
if (!fse.pathExistsSync(toRenderPath)) {
    throw new Error(`toRenderJson not found in '${srcDirPath}': generate this using make_render_json.js`);
}
const toRender = fse.readJsonSync(toRenderPath);

const config = {
    targetDir: path.resolve(path.join(srcDirPath, "chapters")),
    processedBlockGrafts: ['heading'],
    supportedBlockTags: ['b', 'd', 'm', 'mr', 'ms', 'ms2', 'p', 'pc', 'pi', 'q', 'q2', 'q3', 'q4', 'qa', 'r', 's'],
    headingBlockTags: ['d', 'mr', 'ms', 'ms2', 'r', 's'],
    supportedSpans: ['wj', 'it', 'qs', 'bd', 'sc', 'sls'],
};
const processingModel = new ScriptureParaModel(toRender, config);
const docSetModel = new AppHtmlDocSetModel(toRender, processingModel.context, config);
const documentModel = new AppHtmlDocumentModel(docSetModel.result, docSetModel.context, docSetModel.config);
docSetModel.addDocumentModel('default', documentModel);
processingModel.addDocSetModel('default', docSetModel);

processingModel.render();
