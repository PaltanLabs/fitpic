import robots from "../app/robots";

describe("robots.ts", () => {
  test("allows all paths by default", () => {
    const config = robots();
    expect(config.rules).toEqual(
      expect.objectContaining({ userAgent: "*", allow: "/" })
    );
  });

  test("disallows /ingest/ path", () => {
    const config = robots();
    expect(config.rules).toEqual(
      expect.objectContaining({ disallow: "/ingest/" })
    );
  });

  test("includes sitemap URL", () => {
    const config = robots();
    expect(config.sitemap).toContain("/sitemap.xml");
  });
});
