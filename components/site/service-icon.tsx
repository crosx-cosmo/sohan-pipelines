'use client';

import {
  Siren, Flame, Waves, Droplets, GitBranch, GitFork, Wrench, Building2,
  Clock, BadgeCheck, Tag, ShieldCheck, Users, Sparkles,
  Calendar, Star, PhoneCall, Search, Phone, Mail, MapPin,
  MessageCircle, ArrowRight, ChevronDown, CheckCircle2, Award,
  ThumbsUp, Zap, HeartPulse, Truck, Quote,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Siren, Flame, Waves, Droplets, GitBranch, GitFork, Wrench, Building2,
  Clock, BadgeCheck, Tag, ShieldCheck, Users, Sparkles,
  Calendar, Star, PhoneCall, Search, Phone, Mail, MapPin,
  MessageCircle, ArrowRight, ChevronDown, CheckCircle2, Award,
  ThumbsUp, Zap, HeartPulse, Truck, Quote,
};

export function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] ?? Wrench;
  return <Icon className={className} />;
}
