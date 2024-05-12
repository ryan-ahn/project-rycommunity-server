const { labServices } = require('../services');
const { responseMessage, statusCode, handler } = require('../modules/util');

const createLabController = async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;
  try {
    const serviceResponse = await labServices.createLabService(
      authorization,
      body,
    );
    res
      .status(statusCode.CREATED)
      .json(
        handler.success(
          statusCode.CREATED,
          responseMessage.CREATE_SUCCESS,
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

const readLabDetailController = async (req, res) => {
  const { authorization } = req.headers;
  const { labId } = req.params;
  try {
    const serviceResponse = await labServices.readLabDetailService(
      authorization,
      labId,
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

const readLabListController = async (req, res) => {
  const { authorization } = req.headers;
  const { offset, limit, tab } = req.query;
  try {
    const serviceResponse = await labServices.readLabListService(
      authorization,
      offset,
      limit,
      tab,
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

const updateLabController = async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;
  try {
    await labServices.updateLabService(authorization, body);
    res.status(statusCode.OK);
    res.json(handler.success(statusCode.OK, responseMessage.UPDATE_SUCCESS));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const updateLabLikeController = async (req, res) => {
  const { authorization } = req.headers;
  const { labId } = req.body;
  try {
    await labServices.updateLabLikeService(authorization, labId);
    res.status(statusCode.OK);
    res.json(handler.success(statusCode.OK, responseMessage.UPDATE_SUCCESS));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const createMemberJoinController = async (req, res) => {
  const { authorization } = req.headers;
  const { labId, intro, questions, know } = req.body;
  try {
    await labServices.createMemberJoinService(
      authorization,
      labId,
      intro,
      questions,
      know,
    );
    res.status(statusCode.OK);
    res.json(handler.success(statusCode.OK, responseMessage.CREATE_SUCCESS));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const readMemberDetailController = async (req, res) => {
  const { authorization } = req.headers;
  const { labId, userId } = req.body;
  try {
    const serviceResponse = await labServices.readMemberDetailService(
      authorization,
      labId,
      userId,
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

const readMemberListController = async (req, res) => {
  const { authorization } = req.headers;
  const { labId } = req.body;
  try {
    const serviceResponse = await labServices.readMemberListService(
      authorization,
      labId,
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

const updateMemberConfirmController = async (req, res) => {
  const { authorization } = req.headers;
  const { labId, userId, userGrade } = req.body;
  try {
    const serviceResponse = await labServices.updateMemberConfirmService(
      authorization,
      labId,
      userId,
      userGrade,
    );
    res.status(statusCode.OK);
    res.json(
      handler.success(
        statusCode.OK,
        responseMessage.UPDATE_SUCCESS,
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

const updateLabEndDateController = async (req, res) => {
  const { authorization } = req.headers;
  const { labId } = req.body;
  try {
    const serviceResponse = await labServices.updateLabEndDateService(
      authorization,
      labId,
    );
    res.status(statusCode.OK);
    res.json(
      handler.success(
        statusCode.OK,
        responseMessage.UPDATE_SUCCESS,
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

const readJoinLabDetailController = async (req, res) => {
  const { authorization } = req.headers;
  const { labId } = req.params;
  try {
    const serviceResponse = await labServices.readJoinLabDetailService(
      authorization,
      labId,
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

module.exports = {
  createLabController,
  readLabDetailController,
  readLabListController,
  updateLabController,
  updateLabLikeController,
  createMemberJoinController,
  readMemberDetailController,
  readMemberListController,
  updateMemberConfirmController,
  updateLabEndDateController,
  readJoinLabDetailController,
};
