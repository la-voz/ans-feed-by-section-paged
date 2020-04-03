// Default values for the Core Component
const schemaName = "ans-feed";

const params = {
  section: "text",
  feedPage: "number",
  feedSize: "number"
};

/**
 * @func pattern
 * @param {Object} key
 * @return {String} elastic search query for the feed sections
 */
const pattern = (key = {}) => {
  const website = key["arc-site"] || "Arc Site is not defined.";
  const { section, feedPage = 1, feedSize } = key;

  const searchPath = "/content/v4/search/published";

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
                        "taxonomy.sections._id": section
                      }
                    },
                    {
                      term: {
                        "taxonomy.sections._website": website
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

  const encodedBody = encodeURI(JSON.stringify(body));

  const query = [
    `body=${encodedBody}`,
    `website=${website}`,
    `size=${feedSize}`,
    `from=${(feedPage - 1) * feedSize}`
  ].join("&");

  return `${searchPath}?${query}&sort=display_date:desc`;
};

/**
 * @func resolve
 * @param {Object} key - the value to get the feed info from
 * @return {String} the content api search url for these sections and feed
 *                  offset
 */
const resolve = key => {
  return pattern(key);
};

const source = {
  resolve,
  schemaName,
  params
};

export default source;
