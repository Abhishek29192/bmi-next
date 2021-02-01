#!/bin/bash

# Replace tokens in netlify.toml file with corresponding environment variable values.

sed -i '' 's^CONTENT_SECURITY_POLICY^'"${CONTENT_SECURITY_POLICY}"'^' netlify.toml
