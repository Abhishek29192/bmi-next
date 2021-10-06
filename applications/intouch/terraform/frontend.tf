resource "google_cloud_run_service" "default" {
  name                       = "tf-frontend"
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
        image = "eu.gcr.io/automated-style-303709/intouch-frontend:latest"
        ports {
          container_port = 3000
        }
        env {
          name  = "AUTH0_NAMESPACE"
          value = "https://intouch"
        }
        env {
          name  = "AUTH0_AUDIENCE"
          value = "https://api.intouch.bmigroup.com"
        }
        env {
          name  = "AUTH0_ISSUER_BASE_URL"
          value = "https://intouch-prod.eu.auth0.com"
        }
        env {
          name  = "AUTH0_CLIENT_ID"
          value = "Ewm7rbqSA3cFsmoNvN0CMfY4kuQV25fF"
        }
        env {
          name  = "AUTH0_COOKIE_DOMAIN"
          value = "intouch.dddev.io"
        }
        env {
          name  = "FRONTEND_BASE_URL"
          value = "https://intouch.dddev.io"
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
        env {
          name  = "NODE_ENV"
          value = "production"
        }
        env {
          name  = "ONE_TRUST_GUID"
          value = "c077f356-43eb-416b-81da-cb36e32b3f06-test"
        }
        env {
          name  = "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
          value = "AIzaSyAgm19YJTafOD1jKkLDsx1n0XtVKjpgIQs"
        }
      }
    }
  }
  traffic {
    percent         = 100
    latest_revision = true
  }
}
