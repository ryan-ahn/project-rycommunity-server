const { pilotServices } = require('../services');
const { responseMessage, statusCode, handler } = require('../modules/util');

const sendChatCompletionsController = async (req, res) => {
  const { system, assistant, prompt, temperature } = req.body;
  try {
    const data = await pilotServices.sendChatCompletionsService(
      system,
      assistant,
      prompt,
      temperature,
    );
    res
      .status(statusCode.CREATED)
      .json(handler.success(statusCode.CREATED, responseMessage.SUCCESS, data));
  } catch (error) {
    console.log(error.response.data);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(
        handler.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          responseMessage.INTERNAL_SERVER_ERROR,
        ),
      );
  }
};

module.exports = {
  sendChatCompletionsController,
};
