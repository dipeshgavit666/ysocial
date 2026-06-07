import { ApiResponse } from "../utils/api-response";
import { asyncHander } from "../utils/async-handler";

const healthcheck = asyncHander(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { message: "Server is running " }));
});

export { healthcheck };
