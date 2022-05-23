# Remove Auth0 unverified user

This cron job is to remove unverified auth0 user. The auth0 invitation is simply password update which user cannot register by themself after the invitation has been expired. Hence, the auth0 will create an account with the user email in auth0 database and then send out the invitation.
