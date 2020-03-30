import source from "./";

describe("source.resolve function", () => {
  const key = {
    "arc-site": "test-site",
    section: "section",
    feedSize: 5,
    feedPage: 1
  };

  const body = {
    query: {
      bool: {
        must: [
          {
            term: {
              "revision.published": "true"
            }
          },
          {
            nested: {
              path: "taxonomy.sections",
              query: {
                bool: {
                  must: [
                    {
                      term: {
                        "taxonomy.sections._id": "section"
                      }
                    },
                    {
                      term: {
                        "taxonomy.sections._website": "test-site"
                      }
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    }
  };

  it("Checks that source.resolve returns the right pattern from the key", () => {
    const { feedSize } = key;
    const website = key["arc-site"];
    const encodedBody = encodeURI(JSON.stringify(body));
    const endpoint = `/content/v4/search/published?body=${encodedBody}&website=${website}&size=${feedSize}&from=0&sort=display_date:desc`;
    expect(source.resolve(key)).toBe(endpoint);
  });

  it("Checks that tag return correctly", () => {
    expect(source.resolve(key).includes("section")).toBe(true);
  });

  it('Checks that source.resolve returns "Arc Site is not defined', () => {
    const encodedString = "Arc Site is not defined";
    expect(source.resolve().includes(encodedString)).toBe(true);
  });
});

