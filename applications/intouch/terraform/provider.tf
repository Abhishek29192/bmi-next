provider "google" {
  project     = "automated-style-303709"
  region      = "europe-west2"
  credentials = "gcloud-service-key.json"
}

provider "google-beta" {
  project     = "automated-style-303709"
  region      = "europe-west2"
  credentials = "gcloud-service-key.json"
}
