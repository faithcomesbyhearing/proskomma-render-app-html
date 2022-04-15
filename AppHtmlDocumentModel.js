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
            waitingBlockGrafts: [],
        };
        this.addActions();
    }

    contentDestination(context) {
        if (context.sequenceStack[0].type !== 'main') {
            return 'waitingBlockGrafts';
        } else if (!this.appData.chapter) {
            return 'waitingForChapter';
        } else {
            return 'pageContent';
        }
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

        // Follow some block grafts to secondary content
        this.addAction(
            'blockGraft',
            context => () => true,
            (renderer, context, data) => {
                if (renderer.config.processedBlockGrafts.includes(context.sequenceStack[0].blockGraft.subType)) {
                    renderer.renderSequenceId(data.payload);
                }
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
                        title: `${context.document.headers.toc2 || context.document.headers.toc3 || context.document.headers.bookCode} ${renderer.appData.chapter}`
                    }),
                    ...renderer.appData.waitingForChapter,
                    htmlResources.chapterNumber({
                        b: context.document.headers.bookCode,
                        c: renderer.appData.chapter,
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
                    htmlResources.startVerses({
                        b: context.document.headers.bookCode,
                        c: renderer.appData.chapter,
                        v: renderer.appData.verses,
                    })
                );
                renderer.appData.pageContent.push(
                    htmlResources.verseNumber({
                        b: context.document.headers.bookCode,
                        c: renderer.appData.chapter,
                        v: renderer.appData.verses
                    })
                );
                renderer.appData.pageContent.push(
                    htmlResources.startVersesContent({
                        b: context.document.headers.bookCode,
                        c: renderer.appData.chapter,
                        v: renderer.appData.verses,
                    })
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

        // Start block items (after blockGrafts)
        this.addAction(
            'startItems',
            (context) => true,
            (renderer, context, data) => {
                const blockType = context.sequenceStack[0].block.blockScope.split("/")[1];
                if (!renderer.config.supportedBlockTags.includes(blockType)) {
                    console.log(`WARNING: unexpected blockTag ${blockType}`);
                }
                if (context.sequenceStack[0].type === 'main') {
                    renderer.appData.waitingBlockGrafts.forEach(g => renderer.appData[renderer.appData.chapter ? 'pageContent' : 'waitingForChapter'].push(g));
                    renderer.appData.waitingBlockGrafts = [];
                }
                renderer.appData[this.contentDestination(context)].push(
                    htmlResources.startBlock({
                        blockType,
                        isHeading: renderer.config.headingBlockTags.includes(blockType),
                    })
                );
                if (renderer.appData.verses && context.sequenceStack[0].type === 'main') {
                    renderer.appData.pageContent.push(
                        htmlResources.startVerses({
                            b: context.document.headers.bookCode,
                            c: renderer.appData.chapter,
                            v: renderer.appData.verses,
                        })
                    );
                    renderer.appData.pageContent.push(
                        htmlResources.startVersesContent({
                            b: context.document.headers.bookCode,
                            c: renderer.appData.chapter,
                            v: renderer.appData.verses,
                        })
                    );
                }
            }
        );

        // End Items in block
        this.addAction(
            'endItems',
            () => true,
            (renderer, context, data) => {
                if (renderer.appData.chapter) {
                    if (renderer.appData.verses && context.sequenceStack[0].type === 'main') {
                        renderer.appData.pageContent.push(
                            htmlResources.endVersesContent()
                        );
                        renderer.appData.pageContent.push(
                            htmlResources.endVerses()
                        );
                    }
                    renderer.appData[this.contentDestination(context)].push(
                        htmlResources.endBlock()
                    );
                } else if (context.sequenceStack[0].type !== 'main') {
                    renderer.appData[this.contentDestination(context)].push(
                        htmlResources.endBlock()
                    );
            }
        }
        );

        // Start character-level markup (span)
        this.addAction(
            'scope',
            (context, data) => data.subType === 'start' && data.payload.startsWith("span/"),
            (renderer, context, data) => {
                const spanType = data.payload.split('/')[1];
                if (!renderer.config.supportedSpans.includes(spanType)) {
                    console.log(`WARNING: unexpected character-level tag ${spanType}`);
                }
                renderer.appData[this.contentDestination(context)].push(
                    htmlResources.startCharacterSpan({spanType})
                );
            }
        );

        // End character-level markup (span)
        this.addAction(
            'scope',
            (context, data) => data.subType === 'end' && data.payload.startsWith("span/"),
            (renderer, context, data) => {
                renderer.appData[this.contentDestination(context)].push(
                    htmlResources.endCharacterSpan({spanType: data.payload.split('/')[1]})
                );
            }
        );

        // Token
        this.addAction(
            'token',
            () => true,
            (renderer, context, data) => {
                if (["lineSpace", "eol"].includes(data.subType)) {
                    renderer.appData[this.contentDestination(context)].push(" ");
                } else {
                    renderer.appData[this.contentDestination(context)].push(
                        data.payload
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                    )
                    ;
                }
            }
        );

    }

};
