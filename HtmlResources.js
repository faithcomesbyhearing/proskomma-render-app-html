const startHtml = ({title}) => `<?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/strict.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" >
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <title>%title%</title>
    </head>
    <body dir="ltr" class="section-document">
`.replace('%title%', title);

const endHtml = () => `</body>
</html>
`;

export {startHtml, endHtml};
