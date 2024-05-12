const { mainServices } = require('../services');
const { responseMessage, statusCode, handler } = require('../modules/util');

const readPopDetailController = async (req, res) => {
  const { authorization } = req.headers;
  const { popId } = req.params;
  try {
    const serviceResponse = await mainServices.readPopDetailService(
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

const readOngoingPopListController = async (req, res) => {
  const { authorization } = req.headers;
  try {
    const serviceResponse = await mainServices.readOngoingPopListService(
      authorization,
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

const readFinishedPopListController = async (req, res) => {
  const { authorization } = req.headers;
  const { offset, limit } = req.query;
  try {
    const serviceResponse = await mainServices.readFinishedPopListService(
      authorization,
      offset,
      limit,
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

const readCategoryListController = async (_, res) => {
  try {
    const serviceResponse = await mainServices.readCategoryListService();
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

const readRecommendLabListController = async (req, res) => {
  try {
    const serviceResponse = await mainServices.readRecommendLabListService();
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

const readRecommendPostListController = async (req, res) => {
  try {
    const serviceResponse = await mainServices.readRecommendPostListService();
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

const readEventDetailController = async (req, res) => {
  const { eventId } = req.params;
  try {
    const serviceResponse = await mainServices.readEventDetailService(eventId);
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

const readBannerListController = async (_, res) => {
  try {
    const serviceResponse = await mainServices.readBannerListService();
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

const readJoinPopDetailController = async (req, res) => {
  const { authorization } = req.headers;
  const { popId } = req.params;
  try {
    const serviceResponse = await mainServices.readJoinPopDetailService(
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

const createJoinPopMemberController = async (req, res) => {
  const { authorization } = req.headers;
  const { popId, onoff, know, use, job } = req.body;
  try {
    const serviceResponse = await mainServices.createJoinPopMemberService(
      authorization,
      popId,
      onoff,
      know,
      use,
      job,
    );
    res.status(statusCode.CREATED);
    res.json(
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

const readCheckPopMemberController = async (req, res) => {
  const { authorization } = req.headers;
  const { popId } = req.params;
  try {
    const serviceResponse = await mainServices.readCheckPopMemberService(
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

const readJoinConDetailController = async (req, res) => {
  const { authorization } = req.headers;
  const { conId } = req.params;
  try {
    const serviceResponse = await mainServices.readJoinConDetailService(
      authorization,
      conId,
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

const createJoinConMemberController = async (req, res) => {
  const { authorization } = req.headers;
  const {
    conId,
    question1,
    question2,
    question3,
    question4,
    question5,
    question6,
    question7,
    question8,
    question9,
  } = req.body;
  try {
    const serviceResponse = await mainServices.createJoinConMemberService(
      authorization,
      conId,
      question1,
      question2,
      question3,
      question4,
      question5,
      question6,
      question7,
      question8,
      question9,
    );
    res.status(statusCode.CREATED);
    res.json(
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

const readCheckConMemberController = async (req, res) => {
  const { authorization } = req.headers;
  const { conId } = req.params;
  try {
    const serviceResponse = await mainServices.readCheckConMemberService(
      authorization,
      conId,
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
  readPopDetailController,
  readOngoingPopListController,
  readFinishedPopListController,
  readCategoryListController,
  readRecommendLabListController,
  readRecommendPostListController,
  readEventDetailController,
  readBannerListController,
  readJoinPopDetailController,
  createJoinPopMemberController,
  readCheckPopMemberController,
  readJoinConDetailController,
  createJoinConMemberController,
  readCheckConMemberController,
};
