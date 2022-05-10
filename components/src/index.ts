// istanbul ignore file: doesn't hold any logic
import Accordion, { AccordionSummaryProps } from "./accordion";
import AlertBanner from "./alert-banner";
import AlternativeContent from "./alternative-content";
import AnchorLink, { AnchorLinkProps } from "./anchor-link";
import ArrowControl from "./arrow-control";
import Autocomplete, { AutocompleteProps } from "./autocomplete";
import BackToTop from "./back-to-top";
import BrandIntroCard from "./brand-intro-card";
import Breadcrumbs, { BreadcrumbsProps } from "./breadcrumbs";
import Bullets from "./bullets";
import Button, { ButtonProps, IconButtonProps } from "./button";
import Card, {
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  CardProps
} from "./card";
import CardCheckboxGroup from "./card-checkbox-group";
import CardInput, { CardInputProps } from "./card-input";
import CardRadioGroup, { CardRadioGroupProps } from "./card-radio-group";
import Carousel, { getPageFromAbsoluteIndex } from "./carousel";
import Checkbox, { Props as CheckboxProps } from "./checkbox";
import Chip, { Props as ChipProps } from "./chip";
import Clickable, {
  ClickableAction,
  ClickableDefault,
  ClickableProps,
  DownloadLink,
  HtmlLink,
  RouterLink,
  withClickable
} from "./clickable";
import ColorPair, {
  availableThemes,
  ColorPairContext,
  Colors,
  darkThemes
} from "./color-pair";
import CompanyDetails, {
  CompanyDetailProps,
  RoofProLevel
} from "./company-details";
import Container, { ContainerProps } from "./container";
import ContainerDialog from "./container-dialog";
import CTACard from "./cta-card";
import Dialog, { DialogClassNameContext } from "./dialog";
import DownloadList, { DownloadListContext } from "./download-list";
import EqualHeights from "./equal-heights";
import ExpandableCard, { ExpandableCardProps } from "./expandable-card";
import ExpandableLinksTextCard from "./expandable-links-text-card";
import ExploreBar from "./explore-bar";
import Filters, { Filter, FilterProps } from "./filters";
import Footer, { MenuItem as FooterMenuItem } from "./footer";
import Form, {
  FormContext,
  FormProps,
  InputValue,
  ValidationResult,
  Values as FormValues,
  withFormControl
} from "./form";
import GeolocationButton from "./geolocation-button";
import GoogleApi, {
  AutocompletePrediction,
  AutocompleteService,
  AutocompletionRequest,
  computeDistanceBetween,
  Geocoder,
  GeocoderRequest,
  GeocoderResult,
  Google,
  LatLngBounds,
  LatLngBoundsLiteral,
  LatLngLiteral,
  loadGoogleApi,
  Map,
  MapOptions,
  Marker,
  MarkerOptions,
  MarkerOptionsWithData,
  Point
} from "./google-api";
import GoogleAutocomplete, {
  GoogleAutocompleteProps
} from "./google-autocomplete";
import GoogleMap, { GoogleMapProps } from "./google-map";
import Grid, { GridProps, GridSize } from "./grid";
import Header from "./header";
import Hero, { HeroItem } from "./hero";
import HidePrint from "./hide-print";
import Icon, {
  Arrow,
  Box,
  CertificationFlatRoof,
  CertificationOtherTraining,
  CertificationPitchedRoof,
  Cross,
  Design,
  Download,
  External,
  Facebook,
  FileJPEG,
  FileJPG,
  FilePDF,
  FilePNG,
  FlatRoof,
  FolderZip,
  HardHatHead,
  iconMap,
  IconName,
  LinkedIn,
  LocationOn,
  Mail,
  OtherTraining,
  Phone,
  PhoneMobile,
  PitchedRoof,
  PlayArrow,
  QuestionMark,
  SelectRoof,
  SelectTile,
  SelectWallColour,
  TileColour,
  User,
  YouTube
} from "./icon";
import IconList from "./icon-list";
import SignupBlock from "./signup-block";
import InputGroup from "./input-group";
import LanguageSelection, {
  languages,
  LanguageSelectionItem,
  LanguageSelectionList
} from "./language-selection";
import LeadBlock from "./lead-block";
import LinkCard, { LinkCardProps } from "./link-card";
import LocationCard, {
  LocationCardDetailProps,
  LocationItem
} from "./location-card";
import Logo, {
  AeroDek,
  Awak,
  BMI,
  BMI_Academy_DE,
  BMI_Academy_EN,
  BMIAcademy,
  Braas,
  Bramac,
  Cobert,
  Coverland,
  Esha,
  Everguard,
  Everlite,
  GuaranteeProduct,
  GuaranteeSolution,
  GuaranteeSystem,
  iconMap as logoIconMap,
  Icopal,
  IcopalKatto,
  Monarflex,
  Monarplan,
  Monier,
  Necoflex,
  Ormax,
  Redland,
  RoofPro,
  RoofProElite,
  RoofProExpert,
  RoofProPartner,
  RoofProPartnerSmall,
  RoofProServiceTeam,
  Sealoflex,
  Siplast,
  Standard,
  StandardCentred,
  StandardPale,
  Sunscape,
  Vedag,
  Villas,
  Wierer,
  Wolfin,
  Zanda
} from "./logo";
import MasonryGrid from "./masonry-grid";
import Media, { AcceptedNode } from "./media";
import MediaGallery, { MediaData, YoutubeContext } from "./media-gallery";
import MicroCopy, { getMicroCopy, MicroCopyContext } from "./micro-copy";
import Navigation, {
  LinkList,
  NavigationList,
  NavigationListButton
} from "./navigation";
import NBACard, { NBACardProps } from "./nba-card";
import OverviewCard, { OverviewCardProps } from "./overview-card";
import Pagination from "./pagination";
import PostItCard from "./post-it-card";
import ProductDetailsCard from "./product-details-card";
import ProductOverviewPane, {
  ProductOverviewPaneProps
} from "./product-overview-pane";
import ProfileCard from "./profile-card";
import PromoSection from "./promo-section";
import RadioButton, { RadioButtonProps } from "./radio-button";
import RadioGroup from "./radio-group";
import RadioPane, { RadioPaneProps } from "./radio-pane";
import ResponseMessage from "./response-message";
import RollerSelector from "./roller-selector";
import Search, { QUERY_KEY } from "./search";
import Section, {
  BackgroundColor as SectionBackgroundColor,
  SectionContext,
  SectionProps
} from "./section";
import Select, { MenuItem as SelectMenuItem, SelectProps } from "./select";
import ShareWidget from "./share-widget";
import ShowMore from "./show-more";
import SlideControls, {
  SlideControlsProps,
  StateSlideControls
} from "./slide-controls";
import SpotlightHero from "./spotlight-hero";
import Table from "./table";
import TableOfContent from "./table-of-content";
import Tabs, { Tab, TabProps } from "./tabs";
import TextField, {
  InputAdornment,
  TextField as RawTextField,
  TextFieldProps
} from "./text-field";
import ThemeProvider, { getTheme } from "./theme-provider";
import ThumbScrollerButton from "./thumb-scroller-button";
import Thumbnail, { ThumbnailProps } from "./thumbnail";
import TileList from "./tile-list";
import ToggleCard, { ToggleCardProps } from "./toggle-card";
import Tooltip, { TooltipProps } from "./tooltip";
import Truncate from "./truncate";
import TwoPaneCarousel, {
  Slide as TwoPaneCarouselSlide
} from "./two-pane-carousel";
import Typography, { TypographyProps } from "./typography";
import Upload, { getFileSizeString, UploadFile, UploadProps } from "./upload";
import VerticalRoller, {
  Slide as VerticalRollerSlide
} from "./vertical-roller";
import Villain, { VillainProps } from "./villain";
import YoutubeVideo, {
  getDefaultPreviewImage,
  Layout,
  YoutubeVideoProps,
  GTM
} from "./youtube-video";
import { transformHyphens } from "./utils/commonUtils";

export type {
  AccordionSummaryProps,
  AnchorLinkProps,
  AutocompleteProps,
  BreadcrumbsProps,
  ButtonProps,
  IconButtonProps,
  CardInputProps,
  CardRadioGroupProps,
  CheckboxProps,
  ChipProps,
  ClickableProps,
  ClickableDefault,
  DownloadLink,
  HtmlLink,
  RouterLink,
  ClickableAction,
  Colors,
  CompanyDetailProps,
  RoofProLevel,
  ContainerProps,
  ExpandableCardProps,
  Filter,
  FilterProps,
  FooterMenuItem,
  FormProps,
  ValidationResult,
  FormValues,
  InputValue,
  AutocompletePrediction,
  AutocompleteService,
  AutocompletionRequest,
  Geocoder,
  GeocoderRequest,
  GeocoderResult,
  Google,
  LatLngBounds,
  LatLngBoundsLiteral,
  LatLngLiteral,
  Map,
  MapOptions,
  Marker,
  MarkerOptions,
  MarkerOptionsWithData,
  Point,
  GoogleAutocompleteProps,
  GoogleMapProps,
  GridProps,
  GridSize,
  HeroItem,
  IconName,
  LanguageSelectionItem,
  LanguageSelectionList,
  LinkCardProps,
  LocationCardDetailProps,
  AcceptedNode,
  MediaData,
  LinkList,
  NavigationList,
  NBACardProps,
  OverviewCardProps,
  ProductOverviewPaneProps,
  RadioButtonProps,
  RadioPaneProps,
  SectionBackgroundColor,
  SectionProps,
  SelectProps,
  SlideControlsProps,
  TabProps,
  TextFieldProps,
  ThumbnailProps,
  ToggleCardProps,
  TooltipProps,
  TwoPaneCarouselSlide,
  TypographyProps,
  UploadFile,
  UploadProps,
  VerticalRollerSlide,
  VillainProps,
  Layout,
  YoutubeVideoProps,
  CardProps,
  GTM
};

export {
  Accordion,
  AlertBanner,
  AlternativeContent,
  AnchorLink,
  ArrowControl,
  Autocomplete,
  BackToTop,
  BrandIntroCard,
  Breadcrumbs,
  Bullets,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  CardActionArea,
  CardCheckboxGroup,
  CardInput,
  CardRadioGroup,
  Carousel,
  getPageFromAbsoluteIndex,
  Checkbox,
  Chip,
  Clickable,
  withClickable,
  ColorPair,
  availableThemes,
  ColorPairContext,
  darkThemes,
  CompanyDetails,
  Container,
  ContainerDialog,
  CTACard,
  Dialog,
  DialogClassNameContext,
  DownloadList,
  DownloadListContext,
  EqualHeights,
  ExpandableCard,
  ExpandableLinksTextCard,
  ExploreBar,
  Filters,
  Footer,
  Form,
  FormContext,
  withFormControl,
  GeolocationButton,
  GoogleApi,
  computeDistanceBetween,
  loadGoogleApi,
  GoogleAutocomplete,
  GoogleMap,
  Grid,
  Header,
  Hero,
  HidePrint,
  Icon,
  Arrow,
  Box,
  Download,
  Facebook,
  LinkedIn,
  Mail,
  Phone,
  PhoneMobile,
  QuestionMark,
  User,
  YouTube,
  FileJPEG,
  FileJPG,
  FilePDF,
  FilePNG,
  Cross,
  Design,
  External,
  HardHatHead,
  LocationOn,
  PlayArrow,
  TileColour,
  SelectRoof,
  SelectTile,
  SelectWallColour,
  CertificationFlatRoof,
  CertificationOtherTraining,
  CertificationPitchedRoof,
  FlatRoof,
  OtherTraining,
  PitchedRoof,
  FolderZip,
  iconMap,
  IconList,
  SignupBlock,
  InputGroup,
  LanguageSelection,
  languages,
  LeadBlock,
  LinkCard,
  LocationCard,
  LocationItem,
  Logo,
  AeroDek,
  Awak,
  BMI,
  BMIAcademy,
  BMI_Academy_EN,
  BMI_Academy_DE,
  Braas,
  Bramac,
  Cobert,
  Coverland,
  Esha,
  Everguard,
  Everlite,
  GuaranteeProduct,
  GuaranteeSolution,
  GuaranteeSystem,
  Icopal,
  IcopalKatto,
  Monarflex,
  Monarplan,
  Monier,
  Necoflex,
  Ormax,
  Redland,
  RoofPro,
  RoofProElite,
  RoofProExpert,
  RoofProPartner,
  RoofProPartnerSmall,
  RoofProServiceTeam,
  Sealoflex,
  Siplast,
  Standard,
  StandardCentred,
  StandardPale,
  Sunscape,
  Vedag,
  Villas,
  Wierer,
  Wolfin,
  Zanda,
  logoIconMap,
  MasonryGrid,
  Media,
  MediaGallery,
  YoutubeContext,
  MicroCopy,
  MicroCopyContext,
  getMicroCopy,
  Navigation,
  NavigationListButton,
  NBACard,
  OverviewCard,
  Pagination,
  PostItCard,
  ProductDetailsCard,
  ProductOverviewPane,
  ProfileCard,
  PromoSection,
  RadioButton,
  RadioGroup,
  RadioPane,
  ResponseMessage,
  RollerSelector,
  Search,
  QUERY_KEY,
  Section,
  SectionContext,
  Select,
  SelectMenuItem,
  ShareWidget,
  ShowMore,
  SlideControls,
  StateSlideControls,
  SpotlightHero,
  Table,
  TableOfContent,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  RawTextField,
  ThemeProvider,
  getTheme,
  ThumbScrollerButton,
  Thumbnail,
  TileList,
  ToggleCard,
  Tooltip,
  Truncate,
  TwoPaneCarousel,
  Typography,
  Upload,
  getFileSizeString,
  VerticalRoller,
  Villain,
  YoutubeVideo,
  getDefaultPreviewImage,
  transformHyphens
};
