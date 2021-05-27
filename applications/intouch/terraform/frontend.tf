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
      }
    }
  }
  traffic {
    percent         = 100
    latest_revision = true
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.default.location
  project  = google_cloud_run_service.default.project
  service  = google_cloud_run_service.default.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
