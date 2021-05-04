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
        image = "eu.gcr.io/automated-style-303709/tf-frontend"
        ports {
          container_port = 3000
        }
        env {
          name  = "NEXT_PUBLIC_APOLLO_CLIENT_URL"
          value = "https://gateway-rfwslk3zjq-nw.a.run.app"
        }
        env {
          name  = "NEXT_PUBLIC_AUTH_DOMAIN"
          value = "intouch-dev.eu.auth0.com"
        }
        env {
          name  = "NEXT_PUBLIC_AUTH_CLIENTID"
          value = "4VTPIsmaL2Mx8LBr4mVSBs0RIQBOOgmF"
        }
        env {
          name  = "NEXT_PUBLIC_AUTH_REDIRECTURI"
          value = "https://localhost:3000"
        }
        env {
          name  = "NEXT_PUBLIC_AUTH_AUDIENCE"
          value = "https://dev-api.intouch.dev"
        }
        env {
          name  = "NEXT_PUBLIC_AUTH_NAMESPACE"
          value = "https://intouch"
        }
        env {
          name  = "NEXT_PUBLIC_DOMAIN"
          value = "tf-frontend-rfwslk3zjq-nw.a.run.app"
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
