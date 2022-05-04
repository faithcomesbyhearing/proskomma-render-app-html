const startHtml = ({title}) => `{
  "title": "%title%",
  "textDirection": "ltr",
  "blocks": [
  `.replace('%title%', title);

const endHtml = () => `}`;

const chapterNumber = ({b, c}) => ``;

const verseNumber = ({b, c, v}) => `{"class": "versesNumber", "data-vn": "${v}", "content": "${v}"},`;

const startVerses = ({b, c, v}) => `{"class": "verses", "data-vs": "${v}", "content": [
`;

const endVerses = () => `]},`;

const startVersesContent = ({b, c, v}) => `{"class": "versesContent", "data-vc": "${v}", "content": [
`;

const endVersesContent = () => `]},`;

const startBlock = ({blockType, isHeading}) => `{"class": "block usfm_${blockType}${isHeading ? ' heading' : ''}", "content": [
`;

const endBlock = () => `]},`;

const startCharacterSpan = ({spanType}) => `{"class": "chars usfm_${spanType}", "content": [
`;

const endCharacterSpan = () => `]},`;

const inlines = ({inlinesOb}) => '],\n "inlineGrafts": {\n' +
    Object.entries(inlinesOb).map(kv => `"${kv[0]}": ${kv[1]}`).join('\n')
    +'}\n';

const inlineAnchor = ({graftType, anchorId}) => `{"class": "inlineGraft ${graftType}", "graftId": "${anchorId}", "content": ["*"]},`;

export {
    startHtml,
    endHtml,
    chapterNumber,
    verseNumber,
    startVerses,
    endVerses,
    startVersesContent,
    endVersesContent,
    startBlock,
    endBlock,
    startCharacterSpan,
    endCharacterSpan,
    inlines,
    inlineAnchor,
};
