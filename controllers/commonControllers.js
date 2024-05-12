const { commonServices } = require('../services');
const { responseMessage, statusCode, handler } = require('../modules/util');

const forDatabaseController = async (req, res) => {
  try {
    const serviceResponse = await commonServices.forDatabaseService();
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
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const readMetaDataController = async (req, res) => {
  const { id } = req.params;
  try {
    const serviceResponse = await commonServices.readMetaDataService(id);
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
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const readCrawlingController = async (req, res) => {
  const { url } = req.body;
  try {
    const serviceResponse = await commonServices.readCrawlingService(url);
    res.status(statusCode.OK);
    res.json(
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
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const createQrDataController = async (req, res) => {
  const { id } = req.body;
  try {
    const serviceResponse = await commonServices.createQrDataService(id);
    res.status(statusCode.OK);
    res.json(
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
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const readQrDataController = async (req, res) => {
  const { authorization } = req.headers;
  const { popId } = req.body;
  try {
    const serviceResponse = await commonServices.readQrDataService(
      authorization,
      popId,
    );
    res.status(statusCode.OK);
    res.json(
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
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const readUserQrDateController = async (req, res) => {
  const { id } = req.body;
  try {
    const serviceResponse = await commonServices.readUserQrDateService(id);
    res.status(statusCode.OK);
    res.json(
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
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

module.exports = {
  forDatabaseController,
  readMetaDataController,
  readCrawlingController,
  createQrDataController,
  readQrDataController,
  readUserQrDateController,
};
