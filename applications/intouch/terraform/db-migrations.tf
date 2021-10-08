resource "google_cloud_run_service" "db-migrations" {
  name                       = "tf-db-migrations"
  location                   = "europe-west2"
  autogenerate_revision_name = true


  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "1"
        "autoscaling.knative.dev/maxScale" = "5"
      }
    }
    spec {
      containers {
        image = "eu.gcr.io/automated-style-303709/tf-db-migrations:latest"
        ports {
          container_port = 3000
        }
        env {
          name  = "PG_USER"
          value = "postgres"
        }
        env {
          name  = "PG_COMPANY_SCHEMA"
          value = "public"
        }
        env {
          name  = "PG_COMPANY_DATABASE"
          value = "companies-db"
        }
        env {
          name  = "PG_TRAINING_DATABASE"
          value = "training-db"
        }
        env {
          name  = "PG_TRAINING_SCHEMA"
          value = "public"
        }
        env {
          name  = "PG_PORT"
          value = "5432"
        }
        env {
          name  = "GCP_SECRET_PROJECT"
          value = "734962646925"
        }
        env {
          name  = "PG_SSL"
          value = "true"
        }
        env {
          name  = "PG_REJECT_UNAUTHORIZED"
          value = "true"
        }
        env {
          name  = "PG_SSL_HOST"
          value = "automated-style-303709:intouch-db"
        }
      }
    }
  }
  traffic {
    percent         = 100
    latest_revision = true
  }
}
