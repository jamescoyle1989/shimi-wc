//Custom script called by build-storybook in package.json to make sure that rebuilding the docs doesn't 
//permanently remove the .nojekyll file which is what saves them from being a broken mess by the time
//github actions gets its hands on them.

import fs from 'fs';

fs.writeFileSync('./docs/.nojekyll', '');