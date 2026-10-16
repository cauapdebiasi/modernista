// Modernista — componentes React. O CSS vem à parte: importe
// "modernista/css/modernista.css" (ou tokens.css + components.css).

export { Switch } from "./components/Switch";
export { MoneyInput, digitsToMoneyStr, moneyStrToNumber } from "./components/MoneyInput";
export { MoneyMask } from "./components/MoneyMask";
export { AutoSaveMoneyField } from "./components/AutoSaveMoneyField";
export { JackpotNumber } from "./components/JackpotNumber";
export { ProgressFill, rampStage } from "./components/ProgressFill";
export { EASE, TOTAL_DURATION_MS, lastAnimated } from "./components/countAnimation";
export { MonthPicker } from "./components/MonthPicker";
export { ToneCard, TONES, TONE_LABEL, type Tone } from "./components/ToneCard";
export { CardIcon, CardPicker, type CardBrand, type CardOption } from "./components/CardIcon";
export { useLongPress } from "./components/useLongPress";
export {
  usePresence,
  Overlay,
  Sheet,
  QuickActionsMenu,
  ConfirmDialog,
  ExplainModal,
  type QuickAction,
  type ExplainRow,
} from "./components/Dialogs";
export {
  Badge,
  Section,
  StatMini,
  GaugeCard,
  RowList,
  SourceTag,
  ListCard,
  FilterPills,
  Segmented,
  ScopeSeg,
  ToggleRow,
  SettingsRow,
  InfoCallout,
  EmptyState,
  type BadgeColor,
  type RowItemData,
} from "./components/Primitives";

export {
  playSound,
  playCountSound,
  isSoundEnabled,
  setSoundEnabled,
  useSoundEnabled,
  type SoundKind,
  type CountDirection,
} from "./sound/sounds";
export { SoundEffects } from "./sound/SoundEffects";
export { pushToast, type ToastKind } from "./sound/toast";

export {
  PALETTES,
  PALETTE_THEME_COLOR,
  PALETTE_STORAGE_KEY,
  HIDE_MONEY_STORAGE_KEY,
  HIDE_MONEY_INIT_SCRIPT,
  paletteInitScript,
  migrateStorageKeysScript,
  setPalette,
  setHideMoney,
  type Palette,
} from "./scripts/init";
