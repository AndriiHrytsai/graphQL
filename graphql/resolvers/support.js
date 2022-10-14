const models = require('../../models');
const { SevenBoom } = require('graphql-apollo-errors');
const { mailHelper, fileUpload } = require('../../helpers');

const supportResolver = {
  async connectWithUs(root, { title, description, file }, context) {
    if (!context.user) {
      throw SevenBoom.unauthorized('Access token not found');
    }
    let pathToFile = null;
    if (file) {
      pathToFile = await fileUpload(file, 'support');
    }

    await models.supportModel.create({
      title,
      description,
      file: pathToFile,
      user_id: context.user.id,
    });
    await mailHelper.sendMail(process.env.ADMIN_EMAIL, 'Support');
    return {
      message: 'User information successfully updated',
    };
  },
};

module.exports = supportResolver;
