import path from 'path';
import fse from "fs-extra";
import {ScriptureParaDocument} from 'proskomma-render';
import * as htmlResources from './HtmlResources.js';

export default class AppHtmlDocumentModel extends ScriptureParaDocument {

    constructor(result, context, config) {
        super(result, context, config);
        this.appData = {
            documentDir: null,
            chapter: null,
            verses: null,
            chapterContent: null,
        };
        this.addActions();
    }

    addActions() {

        // Start of document: remake directory and save path
        this.addAction(
            'startDocument',
            () => true,
            (renderer, context) => {
                const bookCode = context.document.headers.bookCode;
                renderer.appData.docDir = path.join(renderer.config.targetDir, bookCode);
                if (fse.pathExistsSync(renderer.appData.docDir)) {
                    fse.removeSync(renderer.appData.docDir);
                }
                fse.mkdirsSync(renderer.appData.docDir);
            }
        );

        // Start of chapter
        this.addAction(
            'scope',
            (context, data) => data.subType === 'start' && data.payload.startsWith("chapter/"),
            (renderer, context, data) => {
                renderer.appData.chapter = data.payload.split('/')[1];
                renderer.appData.chapterContent = [
                    htmlResources.startHtml({
                        title: `${context.document.headers.bookCode} ${renderer.appData.chapter}`
                    }),
                    htmlResources.chapterNumber({
                        n: renderer.appData.chapter,
                    })
                ];
            }
        );

        // End of chapter
        this.addAction(
            'scope',
            (context, data) => data.subType === 'end' && data.payload.startsWith("chapter/"),
            (renderer, context, data) => {
                renderer.appData.chapterContent.push(htmlResources.endHtml());
                const chapterPath = path.join(renderer.appData.docDir, `ch_${renderer.appData.chapter}.xhtml`);
                fse.writeFileSync(chapterPath, renderer.appData.chapterContent.join(''));
            }
        );

        // Start of verses
        this.addAction(
            'scope',
            (context, data) => data.subType === 'start' && data.payload.startsWith("verses/"),
            (renderer, context, data) => {
                renderer.appData.verses = data.payload.split('/')[1];
                renderer.appData.chapterContent.push(
                    htmlResources.verseNumber({
                        n: renderer.appData.verses
                    })
                );
            },
        );


    }

};
