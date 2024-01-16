
const Address = {
  name: "Address",
  properties: {
    _id: { type: "objectId", mapTo:'id' },
    country: "string!",
    city: "string!",
    subCity: "string?",
    woreda: "string?",
    uniqueIdentifier:"string",//what's this
    streetAddress:"string",
    postalCode:"string",
    createdAt: {
      type: "date",
      default: () => new Date(),
    },
    updatedAt: "date!",
  },
  primaryKey: "_id",
};