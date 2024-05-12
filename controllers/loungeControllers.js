const { loungeServices } = require('../services');
const { responseMessage, statusCode, handler } = require('../modules/util');

const createLoungePostController = async (req, res) => {
  const { authorization } = req.headers;
  const { body, files } = req;
  try {
    const serviceResponse = await loungeServices.createLoungePostService(
      authorization,
      body,
      files,
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

const readLoungePostDetailController = async (req, res) => {
  const { authorization } = req.headers;
  const { postId } = req.params;
  try {
    const serviceResponse = await loungeServices.readLoungePostDetailService(
      authorization,
      postId,
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

const readLoungePostListController = async (req, res) => {
  const { authorization } = req.headers;
  const { offset, limit } = req.query;
  try {
    const serviceResponse = await loungeServices.readLoungePostListService(
      authorization,
      offset,
      limit,
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

const updateLoungePostController = async (req, res) => {
  const { authorization } = req.headers;
  const { body, files } = req;
  try {
    await loungeServices.updateLoungePostService(authorization, body, files);
    res.status(statusCode.OK);
    res.json(handler.success(statusCode.OK, responseMessage.UPDATE_SUCCESS));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const updateLoungePostLikeController = async (req, res) => {
  const { authorization } = req.headers;
  const { postId } = req.body;
  try {
    await loungeServices.updateLoungePostLikeService(authorization, postId);
    res.status(statusCode.OK);
    res.json(handler.success(statusCode.OK, responseMessage.UPDATE_SUCCESS));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const deleteLoungePostController = async (req, res) => {
  const { authorization } = req.headers;
  const { postId } = req.body;
  try {
    await loungeServices.deleteLoungePostService(authorization, postId);
    res.status(statusCode.OK);
    res.json(handler.success(statusCode.OK, responseMessage.DELETE_SUCCESS));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const createLoungePostCommentController = async (req, res) => {
  const { authorization } = req.headers;
  const { postId, comment } = req.body;
  try {
    await loungeServices.createLoungePostCommentService(
      authorization,
      postId,
      comment,
    );
    res.status(statusCode.CREATED);
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

const updateLoungePostCommentController = async (req, res) => {
  const { authorization } = req.headers;
  const { commentId, comment } = req.body;
  try {
    await loungeServices.updateLoungePostCommentService(
      authorization,
      commentId,
      comment,
    );
    res.status(statusCode.OK);
    res.json(handler.success(statusCode.OK, responseMessage.UPDATE_SUCCESS));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const deleteLoungePostCommentController = async (req, res) => {
  const { authorization } = req.headers;
  const { commentId } = req.body;
  try {
    await loungeServices.deleteLoungePostCommentService(
      authorization,
      commentId,
    );
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
  createLoungePostController,
  readLoungePostDetailController,
  readLoungePostListController,
  updateLoungePostController,
  updateLoungePostLikeController,
  deleteLoungePostController,
  createLoungePostCommentController,
  updateLoungePostCommentController,
  deleteLoungePostCommentController,
};
