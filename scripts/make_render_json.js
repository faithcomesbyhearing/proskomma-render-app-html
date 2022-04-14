import fse from 'fs-extra';
import path from 'path';

import {UWProskomma} from 'uw-proskomma';
import {ScriptureParaModelQuery} from 'proskomma-render';

if (process.argv.length !== 3) {
    throw new Error("USAGE: node make_render_json.js <srcDirPath>");
}

const srcDirPath = process.argv[2];

if (!fse.pathExists(srcDirPath)) {
    throw new Error(`Source directory '${srcDirPath}' not found`);
}

const succinct = fse.readJsonSync(path.resolve(path.join(srcDirPath, "succinct.json")));
const pk = new UWProskomma();
pk.loadSuccinctDocSet(succinct);

const result = await ScriptureParaModelQuery(pk, [], []);

fse.writeJsonSync(path.resolve(path.join(srcDirPath, "toRender.json")), result);
