# Monitoring & Alerting

## Why this exists

Between **2026-07-21 and 2026-08-07** every Cloud Function on this project returned HTTP 500 and nobody noticed for 17 days.

Root cause: the Firebase project was downgraded from **Blaze to the Spark (free) plan on 2026-07-16** ("due to activity in the Google Cloud Console"). Cloud Functions do not run on Spark. Hosting and Firestore kept working on the free tier, so the site looked completely normal while:

- the name counter showed `...` everywhere (footer, press page, home)
- **name submissions were silently discarded** — the form caught the error and still showed the success screen
- launch-notification signup, unsubscribe, the witnesses page, the admin panel, confirmation emails and the hourly cache refresh were all dead

The lesson: **the site looking fine is not evidence the backend is fine.** Hosting is static and survives almost anything.

## The check: `/healthCheck`

`https://us-central1-orbital-temple.cloudfunctions.net/healthCheck`

Returns **200** only when the backend is genuinely healthy. Returns **503** otherwise, with a `reason`:

| reason | meaning |
| --- | --- |
| `firestore-unreachable` | Firestore is down or the function can't reach it |
| `name-count-cache-missing` | the `cache/nameCount` doc is gone |
| `name-count-cache-stale` | the cache hasn't been refreshed in over 2 hours |

The staleness check is the important one. `updateNameCountCache` runs hourly via Cloud Scheduler, and a scheduled job can be left orphaned by a plan downgrade. When that happens the read endpoints keep returning **200 with a frozen number** — exactly what happened here, where `getCachedNameCount` served a Jul 21 timestamp for weeks.

**A plain "is it up" probe would have stayed green through this entire outage.** Freshness is what catches it.

One honest limitation: when functions are down, `/healthCheck` is down too, so it can't report *why*. That's fine — the external monitor sees the failure either way. Don't expect a useful error payload in the worst case.

## Setup: UptimeRobot (free tier)

> **Order matters: deploy before configuring the monitor.** `/healthCheck` only exists once `firebase deploy --only functions` has run. Pointing UptimeRobot at it beforehand produces an immediate, permanent alert on an endpoint that was never deployed — which reads as "the monitor is broken" and gets it switched off.

The monitor must live **outside** this Firebase project. The failure mode was "Google turned this project off", so a Google Cloud Monitoring check billed to the same project is a smoke detector wired to the burning building.

1. Create an account at <https://uptimerobot.com> (free tier: 50 monitors, 5-minute interval).
2. Add **Monitor 1 — backend**:
   - Type: `HTTP(s)`
   - URL: `https://us-central1-orbital-temple.cloudfunctions.net/healthCheck`
   - Interval: 5 minutes
   - Alert when: status code is not 200
3. Add **Monitor 2 — site**:
   - Type: `HTTP(s)`
   - URL: `https://orbitaltemple.art/en/`
   - Interval: 5 minutes

   Hosting survived the 2026 outage, but it will not survive a DNS or domain-expiry problem. That is the other way this site goes dark, and monitor 1 would not catch it.
4. Under **My Settings → Alert Contacts**, add email (`edsonpavoni@gmail.com`) and install the UptimeRobot mobile app for push notifications. Email alone is easy to miss for 17 days.

## Also worth turning on

- **Firebase billing alerts.** In the Firebase console the plan-downgrade notice appeared only as an in-console alert. Check that billing email notifications are enabled so a future downgrade arrives in the inbox, not just on a dashboard nobody opens.
- **A budget alert in Google Cloud Billing**, so a runaway cost (the usual reason a billing account gets detached) surfaces before it triggers a downgrade.

## Resilience already built in

Even with every function down, the site now degrades honestly instead of lying:

- **Name counter** falls back to a direct Firestore `getCountFromServer()` aggregation (`src/lib/useNameCount.ts`). Firestore works on Spark, so the number keeps showing.
- **Name submission** falls back to a direct Firestore write (`src/lib/firebaseClient.ts`). The name is saved rather than lost, flagged `needsEnrichment: true`.
- **If both paths fail**, the form shows a real error screen with a retry button. It never claims success for a name it did not save.
- **`enrichPendingSubmissions`** (scheduled, every 15 min) backfills flagged docs: sends the confirmation email that the fallback path could not send, and clears the flag. Without it, a fallback submission would just be a slower silent failure.

IP-based country is the one thing the fallback cannot recover — the IP is gone by the time the backfill runs, so those records get `country: "Unknown"`.
