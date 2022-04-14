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
            pageContent: [],
            waitingForChapter: [],
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
                renderer.appData.pageContent = [
                    htmlResources.startHtml({
                        title: `${context.document.headers.bookCode} ${renderer.appData.chapter}`
                    }),
                    ...renderer.appData.waitingForChapter,
                    htmlResources.chapterNumber({
                        n: renderer.appData.chapter,
                    })
                ];
                renderer.appData.waitingForChapter = [];
            }
        );

        // End chapter
        this.addAction(
            'scope',
            (context, data) => data.subType === 'end' && data.payload.startsWith("chapter/"),
            (renderer, context, data) => {
                renderer.appData.pageContent.push(
                    htmlResources.endBlock()
                );
                renderer.appData.pageContent.push(htmlResources.endHtml());
                const chapterPath = path.join(renderer.appData.docDir, `ch_${renderer.appData.chapter}.xhtml`);
                fse.writeFileSync(chapterPath, renderer.appData.pageContent.join(''));
                renderer.appData.pageContent = [];
                renderer.appData.chapter = null;
            }
        );

        // Start verses
        this.addAction(
            'scope',
            (context, data) => data.subType === 'start' && data.payload.startsWith("verses/"),
            (renderer, context, data) => {
                renderer.appData.verses = data.payload.split('/')[1];
                renderer.appData.pageContent.push(
                    htmlResources.startVerses()
                );
                renderer.appData.pageContent.push(
                    htmlResources.verseNumber({
                        n: renderer.appData.verses
                    })
                );
                renderer.appData.pageContent.push(
                    htmlResources.startVersesContent()
                );
            },
        );

        // End verses
        this.addAction(
            'scope',
            (context, data) => data.subType === 'end' && data.payload.startsWith("verses/"),
            (renderer, context, data) => {
                renderer.appData.pageContent.push(
                    htmlResources.endVersesContent()
                );
                renderer.appData.pageContent.push(
                    htmlResources.endVerses()
                );
                renderer.appData.verses = null;
            },
        );

        // Start block
        this.addAction(
            'startBlock',
            () => true,
            (renderer, context, data) => {
                const blockType = data.bs.payload.split("/")[1];
                renderer.appData[renderer.appData.chapter ? 'pageContent' : 'waitingForChapter'].push(
                    htmlResources.startBlock({
                        blockType,
                    })
                );
                if (renderer.appData.verses) {
                    renderer.appData.pageContent.push(
                        htmlResources.startVerses()
                    );
                    renderer.appData.pageContent.push(
                        htmlResources.startVersesContent()
                    );
                }
            }
        );

        // End block
        this.addAction(
            'endBlock',
            () => true,
            (renderer, context, data) => {
                if (renderer.appData.chapter) {
                    if (renderer.appData.verses) {
                        renderer.appData.pageContent.push(
                            htmlResources.endVersesContent()
                        );
                        renderer.appData.pageContent.push(
                            htmlResources.endVerses()
                        );
                    }
                    renderer.appData.pageContent.push(
                        htmlResources.endBlock()
                    );
                }
            }
        );

    }

};
