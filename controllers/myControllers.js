const { myServices } = require('../services');
const { responseMessage, statusCode, handler } = require('../modules/util');

const readMyPopListController = async (req, res) => {
  const { authorization } = req.headers;
  try {
    const serviceResponse = await myServices.readMyPopListService(
      authorization,
    );
    res
      .status(statusCode.OK)
      .json(
        handler.success(
          statusCode.OK,
          responseMessage.READ_SUCCESS,
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

const readMyLabListController = async (req, res) => {
  const { authorization } = req.headers;
  try {
    const serviceResponse = await myServices.readMyLabListService(
      authorization,
    );
    res
      .status(statusCode.OK)
      .json(
        handler.success(
          statusCode.OK,
          responseMessage.READ_SUCCESS,
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

const deleteJoinConController = async (req, res) => {
  const { authorization } = req.headers;
  const { conId } = req.body;
  try {
    const serviceResponse = await myServices.deleteJoinConService(
      authorization,
      conId,
    );
    res
      .status(statusCode.OK)
      .json(
        handler.success(
          statusCode.OK,
          responseMessage.DELETE_SUCCESS,
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
  readMyPopListController,
  readMyLabListController,
  deleteJoinConController,
};
