// ************************************* MUTATIONS *****************************************

const connectWithUs = (title, description) => `mutation {
  connectWithUs(title: ${title}, description: ${description}) {
    message
  }
}`;

module.exports = {
  connectWithUs,
};
