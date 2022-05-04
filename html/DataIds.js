const startHtml = ({title}) => `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
  <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      <style>
        /* Processor-specific styles */

        .versesNumber {
            font-weight: bold;
            font-size: smaller;
            padding-right: 0.5em;
        }
        
        /* BlockTags (USFM paras)*/
        .usfm_b {
            height: 1em; /* Empty para */
        }
        .usfm_d {
            font-style: italic;
        }
        .usfm_m {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
            text-indent: 0;
        }
        .usfm_mr {
            margin-top: 1em;
            margin-bottom: 0.5em;
            font-size: larger;
            font-weight: bold;
        }
        .usfm_ms {
            margin-top: 1em;
            margin-bottom: 0.5em;
            font-size: larger;
            font-weight: bold;
        }
        .usfm_ms2 {
            margin-top: 1em;
            margin-bottom: 0.5em;
            font-size: larger;
            font-weight: bold;
        }
        .usfm_p {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
            text-indent: 0.5em;
        }
        .usfm_pc {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
            text-align: center;
        }
        .usfm_pi {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
            margin-left: 2em;
            text-indent: 0.5em;
        }
        .usfm_pi2 {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
            margin-left: 3em;
            text-indent: 0.5em;
        }
        .usfm_pi3 {
            margin-top: 0.5em;
            margin-bottom: 0.5em;
            margin-left: 4em;
            text-indent: 0.5em;
        }
        .usfm_q {
            margin-left: 2em;
        }
        .usfm_q2 {
            margin-left: 3em;
        }
        .usfm_q3 {
            margin-left: 4em;
        }
        .usfm_qa {
            font-style: italic;
            text-align: center;
        }
        .usfm_r {
            font-weight: normal;
            font-style: italic;
            margin-top: 0;
            font-size: smaller
        }
        .usfm_s {
            margin-top: 1em;
            margin-bottom: 0.5em;
            font-size: larger;
            font-weight: bold;
        }
        
        /* Spans (USFM character-level markup) */
        
        .usfm_wj {
            color: red;
        }
        .usfm_it {
            font-style: italic;
        }
        .usfm_qs {
            font-style: italic;
        }
        .usfm_bd {
            font-weight: bold;
        }
        .usfm_sc {
            font-variant: small-caps;
        }
        .usfm_sls {
            font-style: italic;
        }
      </style>
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

const verseNumber = ({b, c, v}) => `<span class="versesNumber" data-vn="${v}">${v}</span>`;

const startVerses = ({b, c, v}) => `<span class="verses" data-vs="${v}">`;

const endVerses = () => `</span>`;

const startVersesContent = ({b, c, v}) => `<span class="versesContent" data-vc="${v}">`;

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
