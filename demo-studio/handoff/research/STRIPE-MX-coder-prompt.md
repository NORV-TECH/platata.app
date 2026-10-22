```
STRIPE-MX-1: card payments in Mexico through Stripe (Tap to Pay on Android). Code at 2fd8f9a3, branch sim/usa-canada.

WHAT MONTI DECIDED
1. Mexico takes cards exactly like the US: the owner connects HIS OWN Stripe account (the same Connect flow the US uses), switches Card on, and charges with Tap to Pay on the phone.
2. Platata charges NO fee in Mexico. Only Stripe's own fee. (US/CA keep their 1% / 0.5%.)
3. It is free: no paid connection, no plan, no upgrade, nothing to unlock. Connect Stripe and it works.
4. Everything else in Mexico stays as it is today (taxes, receipts, WhatsApp, connections pricing, units).
5. Brazil: do NOTHING. Stripe has no Tap to Pay and no Terminal in Brazil (not even preview).
   No other Latin American country has Stripe Tap to Pay; Mexico is the only one.

FACTS FROM STRIPE (checked 21 Oct 2026)
- Tap to Pay on Android: Mexico is "Public preview". https://docs.stripe.com/terminal/payments/setup-reader/tap-to-pay?platform=android
- Terminal in Mexico: preview, "only Tap to Pay is available" (no card readers). https://docs.stripe.com/terminal/payments/collect-card-payment/supported-card-brands
- Mexico in person: MXN only; Visa, Mastercard, Amex, Carnet; NO meses sin intereses in person; the Terminal Location must have a valid, correctly formatted Mexican address. https://support.stripe.com/questions/terminal-in-mexico
- Connect: a US platform can have connected accounts in MX. https://docs.stripe.com/docs/connect/explore-connect-guide
- Stripe's Mexico fee carries IVA (online rate 3.6% + MX$3 + IVA). The in-person rate is not on a public page: read it from our Stripe dashboard and tell Monti the real number.

STEP 0: CHECK BEFORE WRITING CODE (stop and report if any fails)
a. In Platata's Stripe platform account: can a Mexican business connect through our existing Connect (OAuth) flow in test mode?
b. Is Tap to Pay on Android (Mexico preview) usable for our platform without asking Stripe for access? If it needs a sales call or a request form, STOP and tell Monti.
c. In test mode, can a Mexican connected account take a card_present PaymentIntent in MXN WITHOUT application_fee_amount?

SERVER (functions/stripe.js, functions/index.js)
- normalizeCountry: accept "MX"/"MEX" -> "MX". Every other country still fails closed.
- Fee: Mexico has no Platata fee. Do NOT send application_fee_amount at all for MX (do not send 0). computeApplicationFeeCents returns ok with feeCents 0 for MX; buildPaymentIntentParams has an MX branch: amount, currency mxn, payment_method_types[]=card_present, automatic capture like the US, no application fee.
- Refunds, capture, fee read-back (stripeChargeIdentity), the account.updated webhook and the dashboard login link must all work for an MX account with NO application fee: never send refund_application_fee when there was no fee; the card-fee report must read Stripe's own fee for MX and include its IVA (check that processing + platform + net still equals the amount when platform = 0 and the fee has a tax part).
- OAuth authorize URL: prefill country MX for a Mexican shop.
- Terminal Location for MX: build the address from the shop's Mexican address (see app part). Never default a country.
- STOREFRONT_STRIPE_COUNTRIES (online store card checkout): leave US/CA only in this round. Mexico online-store card checkout is a later decision for Monti.
- Golden tests for MX next to the US and CA ones (fee, PI params byte for byte, refund without fee, capture).

APP
- CardCountryGate.forCountry: "MX" -> STRIPE. This is the one switch.
- Then read EVERY place that asks CardCountryGate / CardGatewayCountry.STRIPE and every hand-written setOf("US","CA"), and decide each one on purpose. Today's readers include: CheckoutActions, CardPaymentActions, CardReaderActions, PaymentMethodsScreen, TransactionsScreen, DiscountsManagementScreen, BusinessTypeOptions, ShopSettingsStore, OnlineStoreRules, SellOnline, CardDeviceGate, CardDeviceStillWorks, RefundRoute, ReceiptSendRoute, Entitlement.
  Rules for Mexico:
  * Means "a Stripe card country" -> include MX (checkout Card button, the "+ Card · Set up" button for an unconnected owner like the US, Payment methods Card row and "See payouts", Tap to Pay checks, refunds by Stripe, the tip screen and "Ask for a tip" setting).
  * Means something else -> MX stays OUT: Entitlement.FREE_COUNTRIES (Mexico still pays for connections), TaxMath / TaxPriceDefault / ShopSwitches (IVA stays included in prices), UnitPicker, ReceiptSendRoute (Mexico stays WhatsApp), OnlineOrder.taxAddedAtPickup, BusinessAddress split fields (see next point), Interac (Canada only).
- Mexican address for the Terminal Location: calle y número, colonia, código postal (5 digits), municipio/ciudad, estado. The Stripe shop-address form must collect these for a Mexican shop and refuse to create the Location until they are valid. Same Location rules as the US: permanent, never guessed.
- The checkout never offers installments in Mexico.
- Texts: Mexican Spanish, "tarjeta" / "Cobrar con tarjeta". Follow Stripe's marks rules (no possessive or translated "Stripe"). No Visa/Mastercard logos anywhere.
- No change to Colombia (Wompi) or to US/CA behaviour: their tests must stay green byte for byte.

TESTS / PINS
- A table test over every country: only US, CA, MX are STRIPE; CO is WOMPI; everything else NONE.
- MX: checkout shows Card; unconnected owner sees "+ Card · Set up"; tip screen shows; no Platata fee anywhere (sale, refund, accountant sheet); IVA rules unchanged; connections still paid in MX.
- Server: MX PaymentIntent body without application_fee_amount; refund of an MX charge sends no refund_application_fee.
- Add the CLAUDE.md line under choke points 13, 15 and 19.

DEPLOY ORDER (Monti runs it): functions first, then the app build.

Edit only. Do not build, run, install or verify.
```
