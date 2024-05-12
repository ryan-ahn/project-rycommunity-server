const { adminServices } = require('../services');
const { responseMessage, statusCode, handler } = require('../modules/util');

const createManagerSignUpController = async (req, res) => {
  const { email, password, grade } = req.body;
  try {
    const serviceResponse = await adminServices.createManagerSignUpService(
      email,
      password,
      grade,
    );
    res
      .status(statusCode.CREATED)
      .json(
        handler.success(
          statusCode.OK,
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

const readManagerSignInController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const serviceResponse = await adminServices.readManagerSignInService(
      email,
      password,
    );
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

const deleteManagerController = async (req, res) => {
  const { email } = req.body;
  try {
    const serviceResponse = await adminServices.deleteManagerService(email);
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

const createFakeSignUpController = async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;
  try {
    const serviceResponse = await adminServices.createFakeSignUpService(
      authorization,
      body,
    );
    res
      .status(statusCode.CREATED)
      .json(
        handler.success(
          statusCode.OK,
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

const readFakeUserListController = async (req, res) => {
  const { authorization } = req.headers;
  try {
    const serviceResponse = await adminServices.readFakeUserListService(
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
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const readStayLabListController = async (req, res) => {
  const { authorization } = req.headers;
  const { offset, limit } = req.query;
  try {
    const serviceResponse = await adminServices.readStayLabListService(
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

const updateLabStatusController = async (req, res) => {
  const { authorization } = req.headers;
  const { labId, labStatus } = req.body;
  try {
    await adminServices.updateLabStatusService(authorization, labId, labStatus);
    res.status(statusCode.OK);
    res.json(handler.success(statusCode.OK, responseMessage.UPDATE_SUCCESS));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const createPopController = async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;
  try {
    const serviceResponse = await adminServices.createPopService(
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

const updatePopController = async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;
  try {
    await adminServices.updatePopService(authorization, body);
    res.status(statusCode.OK);
    res.json(handler.success(statusCode.OK, responseMessage.UPDATE_SUCCESS));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const readConListController = async (req, res) => {
  const { authorization } = req.headers;
  try {
    const serviceResponse = await adminServices.readConListService(
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

const readPopMemberController = async (req, res) => {
  const { authorization } = req.headers;
  const { popId } = req.params;
  try {
    const serviceResponse = await adminServices.readPopMemberService(
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

const readConMemberController = async (req, res) => {
  const { authorization } = req.headers;
  const { conId } = req.params;
  try {
    const serviceResponse = await adminServices.readConMemberService(
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

const updateConMemberAttendanceController = async (req, res) => {
  const { authorization } = req.headers;
  const { conId, userId, type } = req.body;
  try {
    const serviceResponse =
      await adminServices.updateConMemberAttendanceService(
        authorization,
        conId,
        userId,
        type,
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

const createCategoryController = async (req, res) => {
  const { authorization } = req.headers;
  const { number, name, type } = req.body;
  try {
    await adminServices.createCategoryService(
      authorization,
      number,
      name,
      type,
    );
    res.status(statusCode.OK);
    res.json(
      handler.success(statusCode.CREATED, responseMessage.CREATE_SUCCESS),
    );
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const updateCategoryController = async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;
  try {
    const serviceResponse = await adminServices.updateCategoryService(
      authorization,
      body,
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

const updatePostController = async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;
  try {
    const serviceResponse = await adminServices.updatePostService(
      authorization,
      body,
    );
    res
      .status(statusCode.OK)
      .json(
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

const updatePostCommentController = async (req, res) => {
  const { authorization } = req.headers;
  const { body } = req;
  try {
    const serviceResponse = await adminServices.updatePostCommentService(
      authorization,
      body,
    );
    res
      .status(statusCode.OK)
      .json(
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

const createLabRecommendController = async (req, res) => {
  const { authorization } = req.headers;
  const { labId } = req.body;
  try {
    await adminServices.createLabRecommendService(authorization, labId);
    res.status(statusCode.OK);
    res.json(
      handler.success(statusCode.CREATED, responseMessage.CREATE_SUCCESS),
    );
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const deleteLabRecommendController = async (req, res) => {
  const { authorization } = req.headers;
  const { labId } = req.body;
  try {
    await adminServices.deleteLabRecommendService(authorization, labId);
    res.status(statusCode.OK);
    res.json(handler.success(statusCode.OK, responseMessage.DELETE_SUCCESS));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const createPostRecommendController = async (req, res) => {
  const { authorization } = req.headers;
  const { postId } = req.body;
  try {
    await adminServices.createPostRecommendService(authorization, postId);
    res.status(statusCode.OK);
    res.json(
      handler.success(statusCode.CREATED, responseMessage.CREATE_SUCCESS),
    );
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const deletePostRecommendController = async (req, res) => {
  const { authorization } = req.headers;
  const { postId } = req.body;
  try {
    await adminServices.deletePostRecommendService(authorization, postId);
    res.status(statusCode.OK);
    res.json(handler.success(statusCode.OK, responseMessage.DELETE_SUCCESS));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const createEventController = async (req, res) => {
  const { authorization } = req.headers;
  const { thumbnail, templateList } = req.body;
  try {
    await adminServices.createEventService(
      authorization,
      thumbnail,
      templateList,
    );
    res.status(statusCode.OK);
    res.json(
      handler.success(statusCode.CREATED, responseMessage.CREATE_SUCCESS),
    );
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const deleteEventController = async (req, res) => {
  const { authorization } = req.headers;
  const { eventId } = req.body;
  try {
    await adminServices.deleteEventService(authorization, eventId);
    res.status(statusCode.OK);
    res.json(handler.success(statusCode.OK, responseMessage.DELETE_SUCCESS));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

module.exports = {
  createManagerSignUpController,
  readManagerSignInController,
  deleteManagerController,
  createFakeSignUpController,
  readFakeUserListController,
  readStayLabListController,
  updateLabStatusController,
  createPopController,
  updatePopController,
  readPopMemberController,
  readConListController,
  readConMemberController,
  updateConMemberAttendanceController,
  createCategoryController,
  updateCategoryController,
  updatePostController,
  updatePostCommentController,
  createLabRecommendController,
  deleteLabRecommendController,
  createPostRecommendController,
  deletePostRecommendController,
  createEventController,
  deleteEventController,
};
