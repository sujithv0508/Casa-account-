type IconProps = {
  className?: string
}

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
}

export const MenuIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
)

export const BankIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M3 21h18M4 21V10M20 21V10M2 10l10-6 10 6M6 10v11M10 10v11M14 10v11M18 10v11" />
  </svg>
)

export const ChevronRightIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M9 6l6 6-6 6" />
  </svg>
)

export const SearchIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
)

export const BellIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M6 9a6 6 0 1 1 12 0c0 4.5 1.5 6 1.5 6h-15S6 13.5 6 9Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
)

export const HelpIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.2a2.5 2.5 0 1 1 3.9 2.1c-.9.6-1.4 1.1-1.4 2.2" />
    <path d="M12 17.5h.01" />
  </svg>
)

export const ChevronDownIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M6 9l6 6 6-6" />
  </svg>
)

export const WalletIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a2 2 0 0 1 2 2v1" />
    <rect x="3" y="7.5" width="18" height="12" rx="2.5" />
    <path d="M16 13.2h3" />
  </svg>
)

export const CheckCircleIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.3 2.3L15.5 9.5" />
  </svg>
)

export const DotCircleIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
  </svg>
)

export const EmptyCircleIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <circle cx="12" cy="12" r="9" />
  </svg>
)

export const EditIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
)

export const CopyIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </svg>
)

export const ShieldCheckIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

export const IdIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="9" cy="12" r="2" />
    <path d="M14 10h4M14 14h4M6 16.5c.6-1.3 1.8-2 3-2s2.4.7 3 2" />
  </svg>
)

export const UserIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c1.2-3.4 4-5 7-5s5.8 1.6 7 5" />
  </svg>
)

export const CardIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="2.2" />
    <path d="M2.5 10h19" />
    <path d="M6 14.3h4" />
  </svg>
)

export const BoxIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M21 8l-9-5-9 5 9 5 9-5Z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </svg>
)

export const EuroIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M18 8.2a6.5 6.5 0 1 0 0 7.6" />
    <path d="M4 10h9M4 14h8" />
  </svg>
)

export const BuildingIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <rect x="5" y="3" width="14" height="18" rx="1.5" />
    <path d="M9 8h.01M9 12h.01M9 16h.01M15 8h.01M15 12h.01M15 16h.01" />
  </svg>
)

export const ExchangeIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M4 7h13l-3-3M20 17H7l3 3" />
  </svg>
)

export const DownloadIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M12 3v12M7 10l5 5 5-5" />
    <path d="M4 19h16" />
  </svg>
)

export const MoreIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </svg>
)

export const AtmIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <rect x="7" y="6.5" width="10" height="6" rx="1" />
    <path d="M7 16.5h.01M11 16.5h.01M15 16.5h.01M7 19h.01M11 19h.01M15 19h.01" />
  </svg>
)

export const ChequeIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <rect x="3" y="6" width="18" height="12" rx="1.5" />
    <path d="M6 15h4" />
    <circle cx="16" cy="12" r="2" />
  </svg>
)

export const OverdraftIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
  </svg>
)

export const PricingIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    <circle cx="12" cy="11" r="4.5" />
  </svg>
)

export const IbanIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18" />
    <path d="M7 14h6" />
  </svg>
)

export const StatusShieldIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" />
  </svg>
)

export const ModeIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <circle cx="8" cy="12" r="4.5" />
    <circle cx="16" cy="12" r="4.5" />
  </svg>
)

export const LocationIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.4" />
  </svg>
)

export const CalendarIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
    <path d="M3.5 9.5h17M8 3v3M16 3v3" />
  </svg>
)

export const MessageIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M4 5.5h16v11H9l-4 3.5v-3.5H4Z" />
  </svg>
)

export const HistoryIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
    <path d="M12 8v4l3 2" />
  </svg>
)

export const SwapIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M16 3l4 4-4 4" />
    <path d="M20 7H8a4 4 0 0 0-4 4v1" />
    <path d="M8 21l-4-4 4-4" />
    <path d="M4 17h12a4 4 0 0 0 4-4v-1" />
  </svg>
)

export const CloseIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const ArrowRightIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const RefreshIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M3 12a9 9 0 0 1 15.4-6.4M21 12a9 9 0 0 1-15.4 6.4" />
    <path d="M18.5 3v4.5H14M5.5 21v-4.5H10" />
  </svg>
)

export const PaperclipIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M17 7.5 8.5 16a3 3 0 0 1-4.2-4.2l9-9a4.5 4.5 0 0 1 6.4 6.4l-9.2 9.2a1.8 1.8 0 0 1-2.5-2.5L15 8" />
  </svg>
)

export const PlusIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const ListIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M8 6h13M8 12h13M8 18h13" />
    <path d="M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
)

export const EyeIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const AlertIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M12 3 2 20h20L12 3Z" />
    <path d="M12 10v4M12 17h.01" />
  </svg>
)

export const XCircleIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" />
  </svg>
)

export const UploadCloudIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A5.5 5.5 0 0 1 17.4 8.1 4 4 0 0 1 17 16" />
    <path d="M12 12v7M9 15.5 12 12l3 3.5" />
  </svg>
)

export const LockIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
  </svg>
)

export const ImageIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" stroke="none" />
    <path d="M21 16.5 15.8 11a2 2 0 0 0-2.8 0L4 19.5" />
  </svg>
)

export const FileTextIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v4h4" />
    <path d="M9 12.5h6M9 16h6M9 9h3" />
  </svg>
)

export const TrashIcon = ({ className }: IconProps) => (
  <svg className={className} {...base}>
    <path d="M4 7h16" />
    <path d="M9 7V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V7" />
    <path d="M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7" />
    <path d="M10 11v6M14 11v6" />
  </svg>
)
