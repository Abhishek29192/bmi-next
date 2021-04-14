terraform {
  backend "gcs" {
    bucket      = "statebucket_dev2"
    credentials = "gcloud-service-key.json"
  }
}
