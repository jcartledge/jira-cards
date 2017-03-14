import DB from 'nedb';

const db = new DB({filename: '.db', autoload: true});

const save = (data) => {
  console.dir(data);
  data.ts = (new Date()).valueOf();
  db.insert(data);
}
const load = _ => {
  return new Promise((resolve, reject) => {
    db.find({}, (err, docs) => err ? reject(err) : resolve(docs));
  });
}
export { save, load };
