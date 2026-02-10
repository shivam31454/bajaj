const mathUtils = require('../utils/mathUtils');
const aiService = require('../utils/aiService');
const validators = require('../utils/validators');
const responseHelper = require('../utils/responseHelper');

const handleBFHL = async (req, res) => {
  try {
    // Validate request body
    const validation = validators.validateBFHLRequest(req.body);

    if (!validation.isValid) {
      return res.status(400).json(
        responseHelper.createErrorResponse(validation.message)
      );
    }

    const { operation, value } = validation;
    let result;

    switch (operation) {
      case 'fibonacci':
        result = mathUtils.generateFibonacci(value);
        break;

      case 'prime':
        result = mathUtils.filterPrimes(value);
        break;

      case 'lcm':
        result = mathUtils.calculateLCM(value);
        break;

      case 'hcf':
        result = mathUtils.calculateHCF(value);
        break;

      case 'AI':
        try {
          const answer = await aiService.getSingleWordAnswer(value);
          return res.status(200).json(responseHelper.createSuccessResponse(answer));
        } catch (aiError) {
          if (aiError.message.includes('Gemini API Key is missing')) {
            return res.status(503).json(
              responseHelper.createErrorResponse(
                'GEMINI_API_KEY missing'
              )
            );
          }
          throw aiError;
        }
        break;

      default:
        return res.status(400).json(
          responseHelper.createErrorResponse('Unknown operation')
        );
    }


    return res.status(200).json(responseHelper.createSuccessResponse(result));

  } catch (error) {
    console.error('BFHL Error:', error);
    if (error.message.includes('Failed to generate answer')) {
      return res.status(502).json(
        responseHelper.createErrorResponse(
          'Gemini error'
        )
      );
    }

    return res.status(500).json(
      responseHelper.createErrorResponse(
        'Internal server error'
      )
    );
  }
};

module.exports = {
  handleBFHL,
};
