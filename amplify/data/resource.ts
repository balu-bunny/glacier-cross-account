import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { uploadToGlacier } from '../functions/uploadToGlacier/resource';
import { listCrossAccountFolders } from '../functions/listCrossAccountFolders/resource';

const schema = a.schema({
  FileInfo: a.customType({
    key: a.string().required(),
    size: a.integer().required(),
    lastModified: a.string().required(),
    storageClass: a.string().required(),
  }),

  UploadResult: a.customType({
    success: a.boolean().required(),
    key: a.string(),
    bucket: a.string(),
    storageClass: a.string(),
    message: a.string(),
  }),

  ListResult: a.customType({
    foldersJson: a.string().required(), // JSON string of string array
    filesJson: a.string().required(),   // JSON string of FileInfo array
    bucket: a.string().required(),
  }),

  uploadToGlacier: a
    .query()
    .arguments({
      fileName: a.string().required(),
      fileContent: a.string().required(), // base64 encoded
      folderPath: a.string(),
      contentType: a.string(),
    })
    .returns(a.ref('UploadResult'))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(uploadToGlacier)),

  listCrossAccountFolders: a
    .query()
    .arguments({
      prefix: a.string(),
    })
    .returns(a.ref('ListResult'))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(listCrossAccountFolders)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
