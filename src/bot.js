import fs from 'fs';
import path from 'path';

export default class Bot {
  constructor(adapter) {
    this.adapter = adapter;
  }

  start() {
    const DIRECTORY = 'actions';
    const EXT = '.js';

    fs.readdir(`${__dirname}/${DIRECTORY}`, (err, files) => {
      if (err) throw err;

      files.filter(file => {
        return path.extname(file) === EXT;
      }).map(file => {
        return `./${DIRECTORY}/${file}`;
      }).forEach(action => {
        require(action).start(this.adapter);
      });
    });

    console.log('bot start!');
  }
}
