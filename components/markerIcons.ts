import React from "react";
import {
  Building2,
  Cross,
  FlaskConical,
  House,
  Landmark,
  LucideIcon,
  LucideProps,
  MapPin,
  Palette,
  PersonStanding,
  User,
} from "lucide-react-native";

/**
 * Maps the SF Symbol names stored on `place.icon` (and the special
 * "person" symbol used for the user-location marker) to lucide icons.
 *
 * The app previously rendered these via expo-maps `systemImage`, which
 * accepted SF Symbol names directly. react-native-maps has no equivalent,
 * so each marker renders a lucide icon inside a custom pin instead.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  person: User,
  cross: Cross,
  "cross.fill": Cross,
  "cross.vial": FlaskConical,
  "figure.stand": PersonStanding,
  "building.2": Building2,
  "building.columns": Landmark,
  paintpalette: Palette,
  house: House,
};

/**
 * Render the lucide icon element for an SF Symbol name, falling back to a
 * generic map pin for any symbol we haven't mapped. Returns a React element
 * (not a component) so callers don't create components during render.
 */
export function renderMarkerIcon(
  symbol: string | undefined,
  props: LucideProps
): React.ReactElement {
  const Icon = (symbol && ICON_MAP[symbol]) || MapPin;
  return React.createElement(Icon, props);
}
