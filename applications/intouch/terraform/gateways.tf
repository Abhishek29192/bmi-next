resource "google_api_gateway_api" "intouchapip" {
  provider = google-beta
  api_id = "intouchapip"
}

resource "google_api_gateway_api_config" "intouchapip" {
  provider = google-beta
  api = google_api_gateway_api.intouchapip.api_id
  api_config_id = "pconfig"

  openapi_documents {
    document {
      path = "spec.yaml"
      contents = filebase64("apigateway/openapi.yaml")
    }
  }
}

resource "google_api_gateway_gateway" "intouchapip" {
  provider = google-beta
  api_config = google_api_gateway_api_config.intouchapip.id
  gateway_id = "intouchapip"
}
