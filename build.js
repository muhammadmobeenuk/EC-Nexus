import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('dist/src',{recursive:true});
for (const f of ['index.html','src/app.js','src/styles.css']) await copyFile(f,'dist/'+f);
console.log('Built static app in dist/');
