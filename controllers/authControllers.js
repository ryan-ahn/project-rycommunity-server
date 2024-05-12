const { authServices } = require('../services');
const { responseMessage, statusCode, handler } = require('../modules/util');

const kakaoInitController = async (_, res) => {
  try {
    const serviceResponse = await authServices.kakaoInitService();
    return res.redirect(serviceResponse);
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const kakaoCallbackController = async (req, res) => {
  const { id } = req.params;
  try {
    const serviceResponse = await authServices.kakaoCallbackService(id);
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

const authTokenAccessController = async (req, res) => {
  const { authorization } = req.headers;
  try {
    const serviceResponse = await authServices.authTokenAccessService(
      authorization,
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

const authTokenVerifyController = (req, res) => {
  const { authorization } = req.headers;
  try {
    authServices.authTokenVerifyService(authorization);
    res
      .status(statusCode.OK)
      .json(handler.success(statusCode.OK, responseMessage.SUCCESS));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

const authUpdateUserController = async (req, res) => {
  const { authorization } = req.headers;
  const data = req.body;
  try {
    await authServices.authUpdateUserService(authorization, data);
    res
      .status(statusCode.OK)
      .json(handler.success(statusCode.OK, responseMessage.SUCCESS));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.BAD_REQUEST)
      .json(handler.fail(statusCode.BAD_REQUEST, error.message));
  }
};

module.exports = {
  kakaoInitController,
  kakaoCallbackController,
  authTokenAccessController,
  authTokenVerifyController,
  authUpdateUserController,
};
