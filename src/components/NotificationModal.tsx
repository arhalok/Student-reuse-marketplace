'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { Bell, Sparkles, CheckCircle2, MessageSquare, MapPin, Tag } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNeedBoard: () => void;
  onOpenOffers: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onOpenNeedBoard,
  onOpenOffers,
}) => {
  const { notifications, markNotificationRead } = useMarketplace();

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'MATCH':
        return <Sparkles className="h-4 w-4 text-emerald-600" />;
      case 'OFFER':
        return <MessageSquare className="h-4 w-4 text-indigo-600" />;
      case 'MEETUP':
        return <MapPin className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-amber-600" />;
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Notification Center"
      subtitle="Smart demand matches, offer updates, and safe campus meetups"
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Bell className="h-5 w-5" />
        </div>
      }
      maxWidth="lg"
    >
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-xs">
            No new notifications right now.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.type === 'MATCH') {
                  onClose();
                  onOpenNeedBoard();
                } else if (n.type === 'OFFER' || n.type === 'MEETUP') {
                  onClose();
                  onOpenOffers();
                }
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                n.read
                  ? 'border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-100/60'
                  : 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-zinc-200/70 shadow-2xs shrink-0 mt-0.5">
                  {getNotifIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{n.message}</p>
                  <div className="mt-2 text-[10px] text-zinc-400">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </ModalWrapper>
  );
};
