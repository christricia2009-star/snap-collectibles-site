"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePlatform } from "@/lib/platform";
import {
  ANDROID_TEST_URL,
  APP_NAME,
  BETA_ENDPOINT,
  BETA_INBOX,
} from "@/lib/testing";

type Status = { state: "" | "ok" | "err"; message: string };

/**
 * BassheadOS-style beta request: App name, phone OS, email → FormSubmit.
 * Android testers must copy/keep the Play internal-test URL before leaving.
 */
export default function BetaForm() {
  const { platform, setPlatform } = usePlatform();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ state: "", message: "" });
  const [sending, setSending] = useState(false);
  const [androidGate, setAndroidGate] = useState<{
    email: string;
    sent: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [kept, setKept] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (!androidGate || acknowledged) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [androidGate, acknowledged]);

  const mailtoFallback = (os: string, mail: string) => {
    const subject = `${APP_NAME} beta tester request`;
    const body = [`App Name: ${APP_NAME}`, `Phone OS: ${os}`, `Email: ${mail}`].join(
      "\n",
    );
    window.location.href = `mailto:${BETA_INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(ANDROID_TEST_URL);
      setCopied(true);
    } catch {
      window.prompt("Copy this Play test URL", ANDROID_TEST_URL);
      setCopied(true);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const honey = (form.elements.namedItem("_honey") as HTMLInputElement | null)
      ?.value;
    if (honey) return;

    const mail = email.trim().toLowerCase();
    const os = platform === "ios" ? "iOS" : "Android";
    const emailInput = form.elements.namedItem("email") as HTMLInputElement | null;

    if (!mail || !emailInput?.checkValidity()) {
      setStatus({
        state: "err",
        message: "Need a valid email so we can send the beta invite.",
      });
      return;
    }

    setStatus({ state: "", message: "Sending request…" });
    setSending(true);

    const payload = {
      "App Name": APP_NAME,
      "Phone OS": os,
      email: mail,
      _subject: `${APP_NAME} beta tester request`,
      _template: "table",
      _captcha: "false",
    };

    let sent = false;
    try {
      const response = await fetch(BETA_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      sent = true;
    } catch {
      // Android must see the Play URL first — don't navigate to mailto.
      if (platform !== "android") {
        mailtoFallback(os, mail);
      }
    } finally {
      setSending(false);
    }

    if (platform === "android") {
      setAndroidGate({ email: mail, sent });
      setCopied(false);
      setKept(false);
      setAcknowledged(false);
      setStatus({
        state: "ok",
        message: sent
          ? `Request sent. Save the Play test URL below — Google will not email it to you.`
          : `Couldn't reach the mail service. Copy the Play URL first, then send App name, Android, and email to ${BETA_INBOX}.`,
      });
      return;
    }

    setStatus({
      state: "ok",
      message: sent
        ? `Request sent. We'll follow up at ${mail} for the iOS beta.`
        : `Couldn't reach the mail service. Your mail app should open a message to ${BETA_INBOX} with App name, phone OS, and email.`,
    });
    setEmail("");
  };

  if (androidGate && !acknowledged) {
    return (
      <div className="ack-panel" role="alertdialog" aria-labelledby="ack-title" aria-modal="true">
        <p className="kicker">Android tester URL</p>
        <h3 id="ack-title">Copy this link. Keep it.</h3>
        <p className="form-status" data-state="ok" role="status">
          {status.message}
        </p>
        <p className="ack-warn">
          This URL will be active once your email has been added to the tester
          list. Please allow up to a few hours. Google does not auto-send emails
          to testers — if you leave without this link, you will not get another
          one automatically.
        </p>
        <div className="ack-url-row">
          <div className="ack-url" id="android-test-url">
            {ANDROID_TEST_URL}
          </div>
          <button className="btn btn-ghost" type="button" onClick={copyUrl}>
            {copied ? "Copied" : "Copy URL"}
          </button>
        </div>
        <label className="ack-check">
          <input
            type="checkbox"
            checked={kept}
            onChange={(event) => setKept(event.target.checked)}
          />
          <span>
            I have copied / saved this URL. I understand it will work after my
            email is added to the tester list.
          </span>
        </label>
        <button
          className="btn btn-primary"
          type="button"
          disabled={!kept}
          onClick={() => {
            setAcknowledged(true);
            setEmail("");
          }}
        >
          I&apos;ve saved it — continue
        </button>
        <p className="ack-locked-note">
          You have to acknowledge this before leaving the form. Requested for{" "}
          <span className="mono">{androidGate.email}</span>.
        </p>
        {!androidGate.sent ? (
          <p className="form-note">
            Mail service missed. After you save the URL,{" "}
            <a
              href={`mailto:${BETA_INBOX}?subject=${encodeURIComponent(`${APP_NAME} beta tester request`)}&body=${encodeURIComponent(`App Name: ${APP_NAME}\nPhone OS: Android\nEmail: ${androidGate.email}`)}`}
            >
              open a draft to {BETA_INBOX}
            </a>
            .
          </p>
        ) : null}
      </div>
    );
  }

  if (androidGate && acknowledged) {
    return (
      <div className="ack-panel" role="status">
        <p className="kicker">You&apos;re on the list</p>
        <h3>URL saved. We&apos;ll add {androidGate.email}.</h3>
        <p className="muted">
          Keep{" "}
          <a href={ANDROID_TEST_URL} target="_blank" rel="noopener noreferrer">
            {ANDROID_TEST_URL}
          </a>
          . It goes live once your email is on the tester list — usually within
          a few hours. Google will not email you the invite.
        </p>
      </div>
    );
  }

  return (
    <form className="form" id="beta-form" noValidate onSubmit={onSubmit}>
      <input type="hidden" name="_subject" value={`${APP_NAME} beta tester request`} />
      <input type="hidden" name="_template" value="table" />
      <input
        type="text"
        name="_honey"
        className="honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <label htmlFor="app-name">App name</label>
      <input id="app-name" name="App Name" type="text" value={APP_NAME} readOnly />

      <fieldset className="os-fieldset">
        <legend>Phone OS</legend>
        <div className="os-choice">
          <label className="os-card">
            <input
              type="radio"
              name="Phone OS"
              value="iOS"
              checked={platform === "ios"}
              onChange={() => setPlatform("ios")}
              required
            />
            <span className="os-card-title">iOS</span>
            <span className="os-card-meta">iPhone + iPad</span>
          </label>
          <label className="os-card">
            <input
              type="radio"
              name="Phone OS"
              value="Android"
              checked={platform === "android"}
              onChange={() => setPlatform("android")}
            />
            <span className="os-card-title">Android</span>
            <span className="os-card-meta">Phone + tablet</span>
          </label>
        </div>
      </fieldset>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@collector.local"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <button className="btn btn-primary" type="submit" disabled={sending}>
        {sending ? "Sending…" : "Request to be a beta tester"}
      </button>
      <p className="form-note">
        Sends App name, phone OS, and email to{" "}
        <span className="mono">{BETA_INBOX}</span>. No newsletter. Android testers
        get the Play test URL on-screen after submit.
      </p>
      {status.message ? (
        <p className="form-status" data-state={status.state} role="status">
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
