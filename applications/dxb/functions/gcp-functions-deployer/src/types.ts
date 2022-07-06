export interface FunctionMetadata {
  available_memory_mb?: number;
  build_environment_variables?: null;
  description?: string;
  entry_point: string; // required
  environment_variables?: Record<string, unknown>[];
  event_trigger?: Record<string, unknown>[];
  https_trigger_url?: string;
  id?: string;
  ingress_settings?: string;
  labels?: Record<string, unknown>[];
  max_instances?: number;
  name: string; // required
  project?: string;
  region: string; // required
  runtime: string; // required
  service_account_email?: string;
  source_archive_bucket: string; // required
  source_archive_object: string; // required
  source_repository?: Record<string, unknown>[];
  timeout?: number;
  trigger_http?: boolean;
  vpc_connector?: string;
  vpc_connector_egress_settings?: string;
}
