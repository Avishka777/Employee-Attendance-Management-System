const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = () => jest.fn();

const mockRequest = (data = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    ...data,
  };
};

module.exports = {
  mockRequest,
  mockResponse,
  mockNext,
};