/**
 * Shared testing / TestFlight access details.
 * App is not publicly on the App Store yet — testers request access via email.
 */

export const TESTING_EMAIL = "Testing@snapcollectibles.com";

export const TESTING_MAILTO = (() => {
  const subject = "TestFlight Access Request — Snap Collectibles";
  const body = [
    "Hi Snap Collectibles team,",
    "",
    "I'd like to join the TestFlight beta.",
    "",
    "Name: ",
    "Email: ",
    "Collecting interests (e.g. Funko, sports cards, sneakers): ",
    "",
    "Thanks!",
  ].join("\n");

  return `mailto:${TESTING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
})();
