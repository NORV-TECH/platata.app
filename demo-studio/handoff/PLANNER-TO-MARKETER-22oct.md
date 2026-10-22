# Planner to marketer (updated 22 Oct 2026, 10:45 AM PT) — copy pasted by Monti

The planner keeps the live version in Monti's claude.ai project (features/PLANNER-TO-MARKETER.md). You can't read it from your account: ask Monti to paste the newest one when you need it.

## Your services list (52 items, 21 Oct 8:20 PM): DONE, you can start the services demos
`sim/usa-canada` at `73c65f08` (MERGE-23, pushed 10:30 AM 22 Oct). All 52 items were worked; Monti said finish everything, so his open questions were decided:

* Item 21 (who did the work): in. Booking screen has an optional "who does it" from Team; it carries to the sale, prints "Atendió: Carla" and credits "Ventas por empleado".
* Service length: stored (Room 129), seeded from the researched minutes, editable as "Duración"; used by the double-booking check.
* No-show is stored apart from cancel; Reports counts no-shows.
* Seeded products stay, with generic names (no brands).
* Opening hours stay 8:00 to 20:00 for now (the calendar's language, week start and time format are fixed).
* Online booking page: services with options are now bookable (peluquería 16 of 21, veterinaria 14/16, uñas 17/18, taller 5/19). One more round (REVFIX-14, running now) adds "Precio en el local" services and uses the stored length for slots; record online-booking videos after it lands (about 1 to 3 PM today). The online page needs Monti's deploy (functions + hosting) to show on the web.
* MERGE-22 (`c670dcd6`) and MERGE-23 brought: SVC-1 (till, option sheet, combos, register gate), SVC-2 (Agenda and bookings), SVC-3 (setup, editing a service with Fijo/Desde/En la caja and a tax switch, the booking page with "reserva" words), SVC-4 (receipts, client page, discounts, combos, words, tablets/staff phones), REVFIX-13 (register gate on every saved-ticket door, travel fee, new-client promo, where-modes and trades on tablets and staff phones).
* An independent check of all 52 items at `73c65f08` (REVIEW-13B) is running; anything it finds gets fixed the same way.

Coder's note to Monti (22 Oct, 10:38 AM): the pre-check found 3 more gaps, Lane D is fixing them (shops whose services show a price only in person aren't bookable online yet; online booking slots don't use the stored service length; the new-client promo on older saved discounts), Lane A merges after, Lane C checks all 52 items. "Record everything except online booking now. The online booking videos should wait for the Lane D fix."

## IMPORTANT for US videos (unchanged)
1. Payroll: the US launch waits for Platata's own payroll (separate agent). The old US "Employee pay" is still in the code: don't record it; hold US Team/employee/time clock videos.
2. US cards: on hold. (Monti, 21 Oct: the US and Canada are on hold, don't work on them. Stripe stays an option in the US; another option will come, either-or.) Mexico stays on Stripe.

## Earlier (21 Oct)
MERGE-21: "Cobrar con enlace" (US, CA, MX), deployed. MERGE-20: online orders lower stock; refunds ask "¿Vuelven al inventario?"; fiado permission fixes.

## Parked for Monti (not now, not dropped)
* R15 (when a reminder was last sent) and R24 (no-barcode list for Brazil and the US).
* Cash in and out on the tablet and waiter phone; a per-register "offline" sign.
* Combo name on the stored receipt; "mark one dish ready" kept per station.
* Printers on the tablet and waiter phone; kitchen routing to printers; accountant PDF look; "Tab payments received" in Reports.
* Services: an opening-hours setting; appointment reminders; a stock grant for services staff; the card-surcharge idea in Colombia.

## How to check
Check the code at the newest `sim/usa-canada` commit (`73c65f08`, or newer after MERGE-24).
