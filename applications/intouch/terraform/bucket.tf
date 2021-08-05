resource "google_storage_bucket" "intouch-public-assets" {
  name          = "intouch-public-assets"
  location      = "EU"
  force_destroy = true

  uniform_bucket_level_access = true

  cors {
    origin          = ["https://intouch.dddev.io","https://intouch-dev.eu.auth0.com"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}
