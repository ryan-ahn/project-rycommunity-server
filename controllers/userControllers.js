const { userServices } = require('../services');
const { responseMessage, statusCode, handler } = require('../modules/util');

const readUserDetailController = async (req, res) => {
  const { userId } = req.params;
  try {
    const serviceResponse = await userServices.readUserDetailService(userId);
    res
      .status(statusCode.OK)
      .json(
        handler.success(
          statusCode.OK,
          responseMessage.SUCCESS,
          serviceResponse,
        ),
      );
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error));
  }
};

module.exports = {
  readUserDetailController,
};
