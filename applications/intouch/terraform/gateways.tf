resource "google_api_gateway_api" "intouchapip" {
  provider = google-beta
  api_id   = "intouchapip"
}

resource "google_api_gateway_api_config" "intouchapip" {
  provider      = google-beta
  api           = google_api_gateway_api.intouchapip.api_id
  api_config_id = "pconfig"

  openapi_documents {
    document {
      path     = "spec.yaml"
      contents = filebase64("apigateway/openapi.yaml")
    }
  }
}

resource "google_api_gateway_gateway" "intouchapip" {
  provider   = google-beta
  api_config = google_api_gateway_api_config.intouchapip.id
  gateway_id = "intouchapip"
}

resource "google_cloud_run_service" "tf-gateway" {
  provider                   = google-beta
  name                       = "tf-gateway"
  location                   = "europe-west2"
  autogenerate_revision_name = true


  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "1"
        "autoscaling.knative.dev/maxScale" = "10"
      }

    }
    spec {
      containers {
        image = "gcr.io/automated-style-303709/intouch-api-gateway:latest"
        ports {
          container_port = 8080
        }
        env {
          name  = "COMPANY_SERVICE_URL"
          value = "https://companies-rfwslk3zjq-nw.a.run.app/graphql"
        }
        env {
          name  = "TRAINING_SERVICE_URL"
          value = "https://training-rfwslk3zjq-nw.a.run.app/graphql"
        }
        env {
          name  = "AUTH0_NAMESPACE"
          value = "https://intouch"
        }
        env {
          name  = "AUTH0_AUDIENCE"
          value = "https://dev-api.intouch.dev"
        }
        env {
          name  = "AUTH0_ISSUER_BASE_URL"
          value = "https://intouch-dev.eu.auth0.com"
        }
        env {
          name  = "AUTH0_CLIENT_ID"
          value = "W4gH2YagDOBdMpEUESoC4xZhsZbc3W1S"
        }
        env {
          name  = "CONTENTFUL_API_HOST"
          value = "https://graphql.contentful.com/content/v1"
        }
        env {
          name  = "CONTENTFUL_SPACE_ID"
          value = "opay6t6wwmup"
        }
        env {
          name  = "CONTENTFUL_ENVIRONMENT"
          value = "development"
        }
        env {
          name  = "GCP_SECRET_PROJECT"
          value = "734962646925"
        }
        env {
          name  = "NPM_AUTH_READ_TOKEN"
          value = ""
        }
        env {
          name  = "NODE_ENV"
          value = "production"
        }
      }
    }
  }
  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service_iam_policy" "tf-gateway-public" {
  location = google_cloud_run_service.tf-gateway.location
  project  = google_cloud_run_service.tf-gateway.project
  service  = google_cloud_run_service.tf-gateway.name

  policy_data = data.google_iam_policy.apiauth.policy_data

  depends_on = [
    google_cloud_run_service.tf-gateway,
  ]
}

