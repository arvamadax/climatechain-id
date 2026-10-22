# Netra: Demo Video Script (3:15)

IEEE ClimateChain Global Hackathon 2026, Track 1. English voiceover, English subtitles.
Fits Devpost (3-5 min) and the IEEE Türkiye page (3 min) with one cut.

**Speakers:** Zufar = Project Lead (hook, impact, close). Rofi = Developer (product, chain). Arva = QA (trust, safety, limits).
Record voices separately, one clean take each, then cut to screen capture. Every claim gets an on-screen caption.

---

## 0:00-0:20 | Hook (Zufar)

**Screen:** Black. Caption: "876 million tonnes retired. Who can check them?" Cut to Netra home, Shell search typed in.

> Companies say they are carbon neutral because they retired carbon credits. But the proof is a registry line, a PDF, and a press release.
> Nobody can easily answer two questions: what did this company actually retire, and is any of it real?
> We built Netra. It lets anyone see what a carbon claim is really worth.

## 0:20-0:45 | Problem (Zufar)

**Screen:** Animated bars from the Key findings visual: 1 in 5, 57%, 4.5%.

> We analysed every Verra and Gold Standard retirement since 2020. That is 342,012 records and 876 million tonnes.
> Research says only about one in five of those tonnes is likely a real reduction. And 57 percent cannot even be tied to a named company.
> Worse, one credit can be claimed twice, and no public system stops it.

## 0:45-1:35 | Product demo (Rofi)

**Screen:** Live site, no slides. One continuous flow.

> This is Netra, running live. I search Shell.
> *[Result opens]* Every retirement is grouped to the company, then multiplied by what research found for each project type. Result: a grade from A to E, with the published range, not a single made-up number.
> Next to it, Shell's own reported emissions, and Climate TRACE's independent estimate. For four of fourteen groups, the independent figure is three to six times higher. We show the gap, and we say plainly it is a question to ask, not a verdict.
> *[Paste a green claim into Check]* Now I paste a company's green claim. A language model extracts who, what, and how many tonnes, but a field is kept only if its quote appears word for word in the text. Every number on screen comes from our data, never from the model.
> *[Hidden buyers tab]* And here are the hidden buyers: anonymous, "Not Disclosed", resellers, wallets. Labelled and quantified.

## 1:35-2:25 | Blockchain: the double-claim demo (Rofi)

**Screen:** Proof page, live feed. Then Sepolia Etherscan with the contract.

> A grade is only useful if it cannot be quietly changed or reused. So every published check goes to our ClaimRegistry contract on Ethereum Sepolia.
> We store a hash of the report and one Merkle root of its serial ranges. That costs the same gas, about 590 thousand, for Shell's 684 ranges as for easyJet's 10.
> Now watch. A second check reuses five of Shell's serial ranges.
> *[Cut: new row appears, red flag]* Our always-on watcher reads it, verifies it against the on-chain root, and challenges it. The contract verifies both Merkle proofs itself. It flagged this in about ten seconds, with no human involved.
> Anyone can verify this. No account. No trust in us.

## 2:25-2:50 | Security and honesty (Arva)

**Screen:** Limitations section of About, METHODS.md, contract tests passing.

> As QA, my job was to try to break this.
> A wrong challenge fails on-chain. The claim checker is rate limited, stores no text, and falls back to plain name search. The watcher key is testnet only and stops below a safe balance.
> And we state our limits. Research ratios are averages by project type, not verdicts on a company. Sixty-two percent of tonnes have no published ratio, so we do not score them. Everything runs on testnet.
> *[Optional, only if real: one line of user-testing result.]*

## 2:50-3:15 | Impact and close (Zufar)

**Screen:** Roadmap, then logo and URL.

> The EU now restricts "carbon neutral" claims on products sold there. Regulators, auditors, journalists and buyers need exactly this: a neutral, open way to check a claim.
> Netra is open source, MIT licensed, fully static, and built on public data under open licences. Next: a daily on-chain root for the live feed, and Gold Standard in the live check.
> Carbon credits only help the climate if the claim behind them is true. Netra makes it checkable.
> Netra. Open it now: netra.rofihosted.space.

---

## Criteria coverage (do not read aloud)

| Judging criterion | Where the video proves it |
|---|---|
| Climate Impact (30%) | 0:20 findings, 2:50 impact |
| Technical Innovation / Blockchain (30%) | 1:35 Merkle root, constant gas, live double-claim challenge |
| Feasibility and Quality | 0:45 live working app, no mockups |
| Data Security and Transparency | 2:25 safeguards, open data, quote-checked AI |
| User Experience and Design | 0:45 single flow, grades A-E, EN/ID switch |
| Scalability and Sustainability | 1:35 constant gas, 2:50 static site and roadmap |
| Presentation and Storytelling | Hook, one flow, three voices, honest limits |

## Before recording

- Confirm the site and watcher are up; pre-seed the duplicate check so the flag appears on cue (or record the real ten seconds and speed-ramp).
- Browser zoom 125%, large cursor, 1080p, no personal tabs.
- Keep "testnet" and "demo duplicate" visible on screen during 1:35-2:25. No false claims.
- Subtitles must be burned in. Music: royalty-free, very low, or none.
- Upload YouTube Public or Unlisted. Backup copy on a second platform.
- For the 3:00 IEEE cut: trim the Hidden buyers line and the Arva optional line.
- Verify before filming: ten-second flag time, 590k gas, 684 and 10 ranges (all from the README, last tested live on Sepolia).
