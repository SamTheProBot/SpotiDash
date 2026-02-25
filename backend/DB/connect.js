const mongoose = require(`mongoose`);

const ConnectDB = async (url) => {
  if (!url) {
    throw new Error('Missing Mongo connection string');
  }

  await mongoose.connect(url);
  console.log(`connected to DB sucessfully`);
};
module.exports = ConnectDB;
