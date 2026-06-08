import {
  HomeModernIcon,
  CubeIcon,
  SwatchIcon,
  GlobeAltIcon,
  ClipboardDocumentListIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";

const ICON_MAP: Record<string, React.ReactNode> = {
  HomeModernIcon: <HomeModernIcon className="w-8 h-8 text-text-dark" />,
  CubeIcon: <CubeIcon className="w-8 h-8 text-text-dark" />,
  SwatchIcon: <SwatchIcon className="w-8 h-8 text-text-dark" />,
  GlobeAltIcon: <GlobeAltIcon className="w-8 h-8 text-text-dark" />,
  ClipboardDocumentListIcon: (
    <ClipboardDocumentListIcon className="w-8 h-8 text-text-dark" />
  ),
  PaintBrushIcon: <PaintBrushIcon className="w-8 h-8 text-text-dark" />,
};

export function getServiceIcon(iconKey?: string): React.ReactNode {
  if (iconKey && ICON_MAP[iconKey]) return ICON_MAP[iconKey];
  return <CubeIcon className="w-8 h-8 text-text-dark" />;
}
