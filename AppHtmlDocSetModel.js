import fse from 'fs-extra';
import { ScriptureDocSet } from 'proskomma-render';

export default class AppHtmlDocSetModel extends ScriptureDocSet {

    constructor(result, context, config) {
        super(result, context, config);
        this.addActions();
    }

    addActions() {

        this.addAction(
            'startDocSet',
            () => true,
            (renderer) => {
                const targetDir = renderer.config.targetDir;
                if (!fse.pathExistsSync(targetDir)) {
                    fse.mkdirs(targetDir);
                }
            }
        );

    }

};
