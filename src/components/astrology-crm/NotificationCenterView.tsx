import React, { useState, useEffect } from "react";
import {
  Bell,
  Sparkles,
  TrendingUp,
  Clock3,
  CheckCheck,
  AlertTriangle,
  Info,
  CreditCard,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CRMNotification, SupportedLanguage } from "@/lib/astrology-crm/crm-types";
import {
  fetchCRMNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/astrology-crm/crm-api";
import { getTranslation } from "@/lib/astrology-crm/i18n-astrology";

interface NotificationCenterViewProps {
  language: SupportedLanguage;
  userId?: string;
}

const NOTIF_ICONS: Record<string, React.ReactNode> = {
  dasha_change: <Sparkles className="size-4 text-purple-500" />,
  transit_change: <TrendingUp className="size-4 text-emerald-500" />,
  saved_muhurat: <Clock3 className="size-4 text-amber-500" />,
  report_ready: <Bell className="size-4 text-blue-500" />,
  subscription_expiry: <CreditCard className="size-4 text-rose-500" />,
  credits_low: <AlertTriangle className="size-4 text-orange-500" />,
};

export function NotificationCenterView({
  language,
  userId = "user-1",
}: NotificationCenterViewProps) {
  const t = getTranslation(language);
  const [notifications, setNotifications] = useState<CRMNotification[]>([]);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

  const loadData = async () => {
    const list = await fetchCRMNotifications(userId);
    setNotifications(list);
  };

  useEffect(() => {
    void loadData();
  }, [userId]);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    void loadData();
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(userId);
    void loadData();
  };

  const filtered = notifications.filter((n) => !filterUnreadOnly || !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Bell className="size-6 text-accent" /> {t.notificationCenter}
          </h2>
          <p className="text-sm text-muted-foreground">
            Alerts for Dasha shifts, planetary transits, saved muhurats, and subscription credits.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={handleMarkAllRead}>
            <CheckCheck className="size-4 text-accent" /> Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant={!filterUnreadOnly ? "default" : "outline"}
          className="text-xs rounded-full"
          onClick={() => setFilterUnreadOnly(false)}
        >
          All Alerts ({notifications.length})
        </Button>
        <Button
          size="sm"
          variant={filterUnreadOnly ? "default" : "outline"}
          className="text-xs rounded-full gap-1.5"
          onClick={() => setFilterUnreadOnly(true)}
        >
          Unread ({unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Bell className="size-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="font-display text-lg font-semibold">No Notifications</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
            You're all caught up! No unread astrology alerts or subscription warnings.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((notif) => (
            <Card
              key={notif.id}
              className={`p-4 transition-all ${
                !notif.read ? "border-accent/40 bg-accent/5" : "bg-card/60"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-secondary shrink-0 mt-0.5">
                    {NOTIF_ICONS[notif.type] || <Info className="size-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        className={
                          notif.severity === "urgent"
                            ? "bg-rose-500 text-white text-[10px]"
                            : notif.severity === "warning"
                            ? "bg-amber-500 text-white text-[10px]"
                            : "bg-blue-500 text-white text-[10px]"
                        }
                      >
                        {notif.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notif.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-base">{notif.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                  </div>
                </div>

                {!notif.read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-accent hover:underline shrink-0"
                    onClick={() => handleMarkRead(notif.id)}
                  >
                    Mark Read
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
