import { gql } from "apollo-server";

export default gql`
  extend type Query {
    session: Session
  }

  type WhiteLabel {
    whitelabel_naming: Int
    whitelabel_disable_naming: Int
    whitelabel_naming_text: String
    whitelabel_naming_site_enable: Int
    whitelabel_naming_site: String
    whitelabel_menu_userid: Int
  }

  type Styles {
    custom_css: String
  }

  type Signin {
    background_type: String
    background_value: String
    background_fallback_image: String
  }

  type Colors {
    mainColor: String
    actionColor: String
    warningColor: String
    errorColor: String
    mainTextColor: String
    secondaryColor: String
    bordersColor: String
    backgroundColor: String
  }

  type BrandingElements {
    white_label: WhiteLabel
    styles: Styles
    signin: Signin
    header: Header
    colors: Colors
  }

  type OauthClients {
    client_id: String
    client_name: String
  }

  type PuManageSubscriptionPermission {
    can_create_bundle: Boolean
  }

  type PuManageUserPermissions {
    can_create: Boolean
    can_view: Boolean
    can_update: Boolean
    can_delete: Boolean
  }

  type ActiveLanguages {
    code: String
    description: String
    browsercode: String
    is_rtl: Boolean
    show_create_user_button: Boolean
    authenticatorapp_pair_date: String
    has_esignature_courses_to_sign: Boolean
    is_impersonated: Boolean
    branding_elements: BrandingElements
    oauth_clients: [OauthClients]
    pre_populated_fields: [String]
    pu_manage_subscription_permission: [PuManageSubscriptionPermission]
    pu_manage_user_permissions: [PuManageUserPermissions]
  }

  type CurrencySettings {
    currency: String
    currency_symbol: String
  }

  type CatalogSettings {
    catalog_type: String
    on_catalogue_empty: Boolean
    catalog_external: Boolean
    catalog_use_categories_tree: Boolean
    show_course_details_dedicated_page: Boolean
    catalog_external_selected_catalogs: String
  }

  type Header {
    iframe_active: Boolean
    iframe_url: String
    iframe_height: Int
    header_message_active: Boolean
    header_message: String
  }

  type Footer {
    footer_type: String
    iframe_height: Int
    iframe_url: Boolean
    custom_html: Boolean
  }

  type Branding {
    header: Header
    footer: Footer
  }

  type PluginMenu {
    label: String
    items: [Items]
  }

  type NotificationBalloon {
    title: String
    content: String
  }

  type NotificationTooltip {
    type: String
    icon: String
    message: String
  }

  type Items {
    label: String
    link: String
    is_new: Boolean
    notification_balloon: [NotificationBalloon]
    notification_tooltip: [NotificationTooltip]
  }

  type MainMenu {
    label: String
    items: [Items]
  }

  type AdminMenuItems {
    plugin_menu: PluginMenu
    main_menu: MainMenu
  }

  type MenuItemsMobile {
    icon: String
    label: String
    route: String
    url: String
    target: String
    is_new: String
    count: Int
  }

  type Skills {
    admin_welcome_dialog_enabled: Boolean
    user_welcome_dialog_enabled: Boolean
  }

  type MenuItems {
    icon: String
    label: String
    route: String
    url: String
    target: String
    is_new: String
    count: Int
  }

  type MultidomainNodeData {
    id: Int
    iLeft: Int
    iRight: Int
    can_manage: Boolean
  }

  type Session {
    id: Int
    username: String
    firstname: String
    lastname: String
    email: String
    user_level: String
    language: String
    dateformat_locale: String
    timezone: String
    avatar_url: String
    has_unfilled_fields: Boolean
    multidomain_id: Int
    home_route: String
    no_suggestion_modals: Boolean
    force_change: Boolean
    is_non_whitelabeled_user: Boolean
    switched_to_new_pages: Boolean
    lms_pages_enable_date: String
    lms_pages_switcher_show: String
    redirect_on_logout: Boolean
    is_erp_admin: Boolean
    need_policy_accept: Boolean
    need_terms_and_conditions_accept: Boolean
    is_instructor: Boolean
    cant_have_direct_manager: Boolean
    is_aoi_profiled: Boolean
    active_languages: [ActiveLanguages]
    currency_settings: CurrencySettings
    catalog_settings: CatalogSettings
    branding: Branding
    admin_menu_items: AdminMenuItems
    menu_items_mobile: [MenuItemsMobile]
    skills: Skills
    menu_items: [MenuItems]
    available_multidomains: [Int]
    multidomain_node_data: MultidomainNodeData
  }
`;
