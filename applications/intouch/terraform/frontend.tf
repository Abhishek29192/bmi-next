resource "google_cloud_run_service" "default" {
  name                       = "tf-frontend"
  location                   = "europe-west2"
  autogenerate_revision_name = true


  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "10"
      }

    }
    spec {
      containers {
        image = "eu.gcr.io/automated-style-303709/intouch-frontend"
        ports {
          container_port = 3000
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
          name  = "AUTH0_COOKIE_DOMAIN"
          value = "tf-frontend-rfwslk3zjq-nw.a.run.app"
        }
        env {
          name  = "GRAPHQL_URL"
          value = "https://intouchapip-9dmxs7t9.nw.gateway.dev/graphql"
        }
        env {
          name  = "GCP_SECRET_PROJECT"
          value = "734962646925"
        }
        env {
          name  = "NPM_AUTH_READ_TOKEN"
          value = ""
        }
      }
    }
  }
  traffic {
    percent         = 100
    latest_revision = true
  }
}
