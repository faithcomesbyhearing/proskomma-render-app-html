const startHtml = ({title}) => `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
  <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      <link href="../../../../styles.css" rel="stylesheet" />
      <title>%title%</title>
  </head>
  <body dir="ltr">
    <div class="chapterBody">
`.replace('%title%', title);

const endHtml = () => `    </div>
  </body>
</html>
`;

const chapterNumber = ({b, c}) => ``;

const verseNumber = ({b, c, v}) => `<span class="versesNumber" data-vn="${b}_${c}_${v}">${v}</span>`;

const startVerses = ({b, c, v}) => `<span class="verses" data-vs="${b}_${c}_${v}">`;

const endVerses = () => `</span>`;

const startVersesContent = ({b, c, v}) => `<span class="versesContent" data-vc="${b}_${c}_${v}">`;

const endVersesContent = () => `</span>`;

const startBlock = ({blockType, isHeading}) => `      <div class="block usfm_${blockType}${isHeading ? ' heading' : ''}">`;

const endBlock = () => `</div>\n`;

const startCharacterSpan = ({spanType}) => `<span class="chars usfm_${spanType}">`;

const endCharacterSpan = () => `</span>`;

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
};
