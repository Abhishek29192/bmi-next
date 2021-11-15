resource "google_cloud_scheduler_job" "certification" {
  name             = "certification_scheduler"
  schedule         = "*/15 * * * *"
  time_zone        = "Europe/London"
  attempt_deadline = "320s"
  region           = "us-west2"

  pubsub_target {
    topic_name = "projects/automated-style-303709/topics/cron-certification"
    data       = base64encode("{}")
  }
}

resource "google_cloud_scheduler_job" "incomplete-reminder" {
  name             = "incomplete_profile_reminder_scheduler"
  schedule         = "0 0 1 */3 *"
  time_zone        = "Europe/London"
  attempt_deadline = "320s"
  region           = "us-west2"

  pubsub_target {
    topic_name = "projects/automated-style-303709/topics/send-reminder"
    data       = base64encode("{}")
  }
}
