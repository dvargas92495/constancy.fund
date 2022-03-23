import type {
  CloudFrontRequest,
  CloudFrontResponseEvent,
  CloudFrontResponseResult,
} from "aws-lambda";
import spawn from "cross-spawn";
import path from "path";

const createCloudfrontRequest = ({
  uri = "/",
  headers = {},
  querystring = "",
  method = "GET",
}: Partial<CloudFrontRequest> = {}): CloudFrontResponseEvent => ({
  Records: [
    {
      cf: {
        request: {
          uri,
          headers,
          querystring,
          clientIp: "",
          method,
        },
        config: {
          distributionDomainName: "constancy.fund",
          distributionId: "1234",
          eventType: "origin-request",
          requestId: "1234",
        },
        response: {
          status: "200",
          statusDescription: "ok",
          headers: {},
        },
      },
    },
  ],
});

const mockContext = {};
const mockCallback = jest.fn();
const nsToMs = (n: bigint) => Number(n) / 1000000;
jest.setTimeout(20000);
const serverOutputFile = path.resolve(process.cwd(), `out/index.js`);

describe("Loads all routes in a reasonable amount of time", () => {
  beforeAll((done) => {
    const proc = spawn("npm", ["run", "build", "--", "--readable"]);
    proc.stdout.on("data", (m) => {
      console.log(m.toString());
    });
    proc.on("error", (e) => {
      console.error(e);
      fail(e);
    });
    proc.on("close", () => {
      // Do a single require of the output file - we are not trying to optimize cold start in these tests
      // We should optimize it though at some point - performance could go from 500ms to < 1ms
      require(serverOutputFile);
      done();
    });
  });

  test("GET `/` route", () => {
    const event = createCloudfrontRequest();
    const { handler } = require(serverOutputFile);
    const startTime = process.hrtime.bigint();
    return handler(event, mockContext, mockCallback).then(
      (res: CloudFrontResponseResult) => {
        const endTime = process.hrtime.bigint();
        expect(res.status).toBe("200");
        expect(nsToMs(endTime - startTime)).toBeLessThan(100);
      }
    );
  });
});
