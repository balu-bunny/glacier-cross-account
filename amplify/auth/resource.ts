import { defineAuth } from '@aws-amplify/backend';

/**
 * Authentication configuration using Amazon Cognito.
 *
 * COGNITO ALLOWS UNLIMITED CONCURRENT LOGINS:
 * - Users can sign in from multiple devices/browsers/tabs simultaneously
 * - There is no limit on the number of login sessions per user
 * - Cognito issues access, ID, and refresh tokens for each login
 * - Multiple refresh tokens can be active at the same time
 * - By default, access tokens expire after 1 hour, but refresh tokens
 *   can be used to get new tokens indefinitely (until revoked)
 *
 * No changes needed for "many logins" - it's the default behavior.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
